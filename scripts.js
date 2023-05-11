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
    'backgrounds/15.png',
    'backgrounds/16.png',
    'backgrounds/17.png',
    'backgrounds/18.png',
    'backgrounds/19.png',
    'backgrounds/20.png',
    'backgrounds/21.png',
    'backgrounds/22.png',
    'backgrounds/23.png',
    'backgrounds/24.png',
    'backgrounds/25.png',
    'backgrounds/26.png',
    'backgrounds/27.png',
    'backgrounds/28.png',
    'backgrounds/29.png',
    'backgrounds/30.png',
    'backgrounds/31.png',
    'backgrounds/32.png',
    'backgrounds/33.png',
    'backgrounds/34.png',
    'backgrounds/35.png',
    'backgrounds/36.png',
    'backgrounds/37.png',
    'backgrounds/38.png',
    'backgrounds/39.png',
    'backgrounds/40.png'
    // Add more image file names here
  ];

  var randomIndex = Math.floor(Math.random() * images.length);
  var randomImage = images[randomIndex];

  document.body.style.backgroundImage = `url('${randomImage}')`;
});
