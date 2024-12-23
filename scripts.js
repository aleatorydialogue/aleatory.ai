function playVideo() {
  var videos = [
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/1.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/2.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/3.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/4.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/5.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/6.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/7.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/8.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/9.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/10.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/11.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/12.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/13.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/14.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/15.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/16.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/17.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/18.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/19.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/20.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/21.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/22.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/23.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/24.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/25.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/26.mp4',
    'https://huggingface.co/aleatorydialogue/ad_backgrounds/resolve/main/27.mp4'
  ];
  var randomIndex = Math.floor(Math.random() * videos.length);
  var randomVideo = videos[randomIndex];
  var videoElement = document.createElement('video');
  videoElement.setAttribute('autoplay', '');
  videoElement.setAttribute('muted', '');
  videoElement.setAttribute('loop', '');
  videoElement.setAttribute('id', 'bgVideo');
  videoElement.setAttribute('playsinline', '');
  videoElement.setAttribute('preload', 'auto');
  videoElement.muted = true; // Ensure muted is set programmatically as well
  var sourceElement = document.createElement('source');
  sourceElement.setAttribute('src', randomVideo);
  sourceElement.setAttribute('type', 'video/mp4');
  videoElement.appendChild(sourceElement);
  document.body.appendChild(videoElement);

  // Try to play as soon as possible
  var playAttempt = setInterval(() => {
    videoElement.play().then(() => {
      clearInterval(playAttempt);
    }).catch(error => {
      console.log('Error attempting to play the video:', error);
    });
  }, 3000);

  // Additional attempt when the video can play through
  videoElement.addEventListener('canplaythrough', () => {
    videoElement.play().catch(error => {
      console.log('Error attempting to play on canplaythrough:', error);
    });
  });
}

// Call playVideo when the page loads
window.addEventListener('load', playVideo);