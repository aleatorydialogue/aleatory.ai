const canvas = document.getElementById('glcanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');

// Vertex shader source code
const vsSource = `
    attribute vec2 aPosition;
    void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;

// Fragment shader source code
const fsSource = `
    precision highp float;

    uniform vec2 uResolution;
    uniform vec2 uCenter;
    uniform float uZoom;
    uniform float uTime;

    void main() {
        // Convert pixel coordinates to complex plane
        vec2 coord = (gl_FragCoord.xy - 0.5 * uResolution) / uZoom + uCenter;

        // Mandelbrot iteration
        vec2 z = vec2(0.0);
        int iterations = 0;
        const int maxIterations = 1000;

        for (int i = 0; i < maxIterations; i++) {
            // Perform iteration
            z = vec2(
                z.x * z.x - z.y * z.y + coord.x,
                2.0 * z.x * z.y + coord.y
            );

            // Check for escape
            if (length(z) > 2.0) {
                iterations = i;
                break;
            }
        }

        // Animated color mapping with slower transitions
        float SPEED = 0.02; // Adjust speed as desired
        float t = fract((float(iterations) / float(maxIterations)) - uTime * SPEED);



        // Gradient from dark blue to green
        vec3 color = mix(vec3(0.0, 0.0, 0.2), vec3(0.2, 0.4, 0), t);

        if (iterations == maxIterations) {
            color = vec3(0.0, 0.0, 0.0); // Inside Mandelbrot set is black
        }

        gl_FragColor = vec4(color, 1.0);
    }
`;

// Initialize shaders
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Link shaders into a program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Error handling
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program:', gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    return shaderProgram;
}

function compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Error handling
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling the shaders:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

// Get attribute and uniform locations
const programInfo = {
    attribLocations: {
        position: gl.getAttribLocation(shaderProgram, 'aPosition'),
    },
    uniformLocations: {
        resolution: gl.getUniformLocation(shaderProgram, 'uResolution'),
        center: gl.getUniformLocation(shaderProgram, 'uCenter'),
        zoom: gl.getUniformLocation(shaderProgram, 'uZoom'),
        time: gl.getUniformLocation(shaderProgram, 'uTime'), // Added uTime uniform
    },
};

// Set up the rectangle covering the canvas
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// Cover the entire canvas
const positions = [
    -1.0,  1.0,
     1.0,  1.0,
    -1.0, -1.0,
     1.0, -1.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const startTime = performance.now();

let initialZoom = canvas.width / 3.0;
let userZoom = 1.0;
let zoom = initialZoom;
let center = { x: -0.5, y: 0.0 };
let isDragging = false;
let lastMousePos = { x: 0, y: 0 };

// Mouse event handlers
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMousePos.x = e.clientX;
    lastMousePos.y = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const dx = e.clientX - lastMousePos.x;
        const dy = e.clientY - lastMousePos.y;
        center.x -= dx / zoom;
        center.y += dy / zoom;
        lastMousePos.x = e.clientX;
        lastMousePos.y = e.clientY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = Math.pow(1.001, -e.deltaY);
    userZoom *= zoomFactor;
});

function render() {
    const currentTime = (performance.now() - startTime) / 1000; // Time in seconds

    // Auto-zoom oscillation with slower speed
    const zoomAmplitude = 1; // Adjust amplitude (0 to 1)
    const zoomFrequency = 0.5 / 10.0; // Slowed down by 400%
    const autoZoomFactor = 2.0 + zoomAmplitude * Math.sin(zoomFrequency * currentTime * 2.0 * Math.PI);

    zoom = initialZoom * userZoom * autoZoomFactor;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use the shader program
    gl.useProgram(shaderProgram);

    // Bind the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(programInfo.attribLocations.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.position,
        2,          // Num components
        gl.FLOAT,   // Type
        false,      // Normalize
        0,          // Stride
        0           // Offset
    );

    // Set uniforms
    gl.uniform2f(programInfo.uniformLocations.resolution, canvas.width, canvas.height);
    gl.uniform2f(programInfo.uniformLocations.center, center.x, center.y);
    gl.uniform1f(programInfo.uniformLocations.zoom, zoom);
    gl.uniform1f(programInfo.uniformLocations.time, currentTime); // Pass time to shader

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Request next frame
    requestAnimationFrame(render);
}

// Start rendering
requestAnimationFrame(render);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initialZoom = canvas.width / 3.0; // Adjust initial zoom based on new size
});
