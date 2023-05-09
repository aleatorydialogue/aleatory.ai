document.addEventListener('DOMContentLoaded', function () {
  var images = [
    '2.png',
    'ad.mp3',
    'bubbles.png',
    'city.png',
    'dead.png',
    'portal.png',
    'skygarden.png',
    // Add more image file names here
  ];

  var randomIndex = Math.floor(Math.random() * images.length);
  var randomImage = images[randomIndex];

  document.body.style.backgroundImage = `url('${randomImage}')`;
});
