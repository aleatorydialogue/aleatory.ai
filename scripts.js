document.addEventListener('DOMContentLoaded', function () {
  var images = [
    'backgrounds/1.png',
    'backgrounds/2.png',
    'backgrounds/3.png',
    'backgrounds/4.png',
    'backgrounds/5.png',
    'backgrounds/6.png',
    'backgrounds/7.png',
    'backgrounds/8.png',
    'backgrounds/9.png',
    'backgrounds/10.png',
    'backgrounds/11.png',
    'backgrounds/12.png',
    'backgrounds/13.png',
    'backgrounds/14.png',
    'backgrounds/15.png'
    // Add more image file names here
  ];

  var randomIndex = Math.floor(Math.random() * images.length);
  var randomImage = images[randomIndex];

  document.body.style.backgroundImage = `url('${randomImage}')`;
});
