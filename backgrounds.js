var backgrounds = [
    'assets/backgrounds/woods.JPG',
    'assets/backgrounds/space.JPG',
    'assets/backgrounds/skyline.jpg'
];

var choice = backgrounds[Math.floor(Math.random() * backgrounds.length)];

document.addEventListener('DOMContentLoaded', function(){
    document.body.style.backgroundImage = 'url(' + choice + ')';
});