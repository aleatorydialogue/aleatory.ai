function playVideo() {
  var videos = [
    'backgrounds/1.mp4',
    'backgrounds/2.mp4',
    'backgrounds/3.mp4',
    'backgrounds/4.mp4',
    'backgrounds/5.mp4'
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