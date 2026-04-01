var backgrounds = [
    'assets/images/woods.JPG',
    'assets/images/space.JPG',
    'assets/images/skyline.jpg'
];

var choice = backgrounds[Math.floor(Math.random() * backgrounds.length)];

document.addEventListener('DOMContentLoaded', function(){
    document.body.style.backgroundImage = 'url(' + choice + ')';
});