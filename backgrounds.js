var backgrounds = [
    'assets/backgrounds/woods.jpg',
    'assets/backgrounds/space.jpg',
    'assets/backgrounds/skyline.jpg'
];

var choice = backgrounds[Math.floor(Math.random() * backgrounds.length)];

document.addEventListener('DOMContentLoaded', function(){
    document.body.style.backgroundImage = 'url(' + choice + ')';
});