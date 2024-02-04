let openaiKey; // Variable to store the user's API key

async function startGame() {
    const initialPrompt = "You are playing the role of the narrator in a text-based game. Please improvise the first scene of a unique setting and provide suggested options for the user to take next. Your answer will then be sent to DALL-E to create a corresponding image to display with the narrative. We will then continue in a turn-based fashion. Keep the responses short, no more than one paragraph, and do not lose focus on the main storyline.";

    // Use the initial prompt to start the game
    await getChatGPTResponse(initialPrompt, []);
}


document.addEventListener('DOMContentLoaded', (event) => {
    openaiKey = prompt("Please enter your OpenAI API key:", "");
    if (!openaiKey) {
        alert("You need to provide an OpenAI API key to use the chatbot.");
    } else {
        // Start the game with an initial prompt
        startGame();
    }
});


// Create context memory
function createMemory(messages) {
    const memory = [];
    for (const msg of messages) {
        memory.push({ role: msg.role, content: msg.content });
    }
    return memory;
}

// send messages
async function sendMessage() {
    const inputElement = document.getElementById('user-input');
    const userInput = inputElement.value.trim();

    if (userInput !== '') {
        showMessage("Guest", userInput);
        chatMemory = await getChatGPTResponse(userInput, chatMemory);
        inputElement.value = '';
    }
}

// show messages in chat div
function showMessage(sender, message) {
    const chatContainer = document.getElementById('chat-container');

    // Clear existing content in the chat container
    chatContainer.innerHTML = '';

    // Create new message
    const messageElement = document.createElement('div');
    messageElement.innerText = `${sender}: ${message}`;

    // Add a class according to the sender
    if (sender === 'Guest') {
        messageElement.classList.add('user-message');
    } else if (sender === 'GPT') {
        messageElement.classList.add('chatgpt-message');

        // Message copy button
        const copyLink = document.createElement('button');
        copyLink.innerText = 'Copy';
        copyLink.style.float = 'right';
        copyLink.addEventListener('click', function (event) {
            event.preventDefault();
            const text = message;
            const input = document.createElement('input');
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        });

        messageElement.appendChild(copyLink);
    }

    // Add the new message to the chat container
    chatContainer.appendChild(messageElement);
}

// fetches the answer
async function getChatGPTResponse(userInput, chatMemory = [], initialPrompt = null) {
    // Use the initialPrompt if provided, otherwise use userInput
    const content = initialPrompt ? initialPrompt : userInput;
    const chatContainer = document.getElementById('chat-container');

    const typingIndicator = document.createElement('p');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.textContent = 'Typing...';
    chatContainer.appendChild(typingIndicator);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                "model": "gpt-3.5-turbo",
                "messages": [
                    ...chatMemory,
                    {"role": "user", "content": userInput}
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Error in the request to\'API');
        }

        const data = await response.json();

        if (!data.choices || !data.choices.length || !data.choices[0].message || !data.choices[0].message.content) {
            throw new Error('Invalid API request');
        }

        const chatGPTResponse = data.choices[0].message.content.trim();
        var cleanResponse = chatGPTResponse.replace(/(```html|```css|```javascript|```php|```python)(.*?)/gs, '$2');
        cleanResponse = cleanResponse.replace(/```/g, "");
        showMessage("GPT", cleanResponse);
        
        // Call DALL-E API to generate an image based on the GPT-4 response
        const dallePrompt = "Paint a picture that illustrates the scene: " + cleanResponse;
        generateDalleImage(dallePrompt);
        
        // pushes the answer into context memory array
        chatMemory.push({ role: 'user', content: userInput });
        chatMemory.push({ role: 'assistant', content: cleanResponse });

        // returns updated context memory array
        return chatMemory;
    } catch (error) {
        console.error(error);
        // .
    }
}

async function generateDalleImage(prompt) {
    const dalleEndpoint = 'https://api.openai.com/v1/images/generations';
    const imageContainer = document.getElementById('dalleImageContainer');

    try {
        const response = await fetch(dalleEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openaiKey}`
            },
            body: JSON.stringify({
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1
            })
        });

        if (!response.ok) {
            throw new Error('Error in the request to DALL-E API');
        }

        const data = await response.json();
        // Correctly access the 'url' property
        const imageUrl = data.data[0].url; // Make sure this matches the response structure

        // Display the image
        imageContainer.innerHTML = `<img src="${imageUrl}" alt="Generated Image">`;
    } catch (error) {
        console.error('Error calling the DALL-E API', error);
        imageContainer.innerHTML = '<p>Failed to load image.</p>';
    }
}

// initialization
let chatMemory = createMemory([
    { role: 'system', content: "We are playing a text based mystery game. Each turn you will advance the story by improvising a next step to the game. Build mystery and focus on chaos, emergent behavior and mysticism. We will then continue in a turn-based fashion. Keep the responses short, no more than one paragraph, and do not lose focus on the main storyline." }
]);


