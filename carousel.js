// Carousel functionality - supports multiple independent carousels
document.addEventListener('DOMContentLoaded', function() {

    // Find all carousel wrapper elements
    // Each carousel wrapper should have:
    //   data-carousel attribute (unique name)
    //   a left button with class "slideLeft"
    //   a right button with class "slideRight"
    //   slides with class "slide" inside it
    const carousels = document.querySelectorAll('[data-carousel]');

    carousels.forEach(function(carouselWrapper) {
        const slides = carouselWrapper.querySelectorAll('.slide');
        const prevButton = carouselWrapper.querySelector('.slideLeft');
        const nextButton = carouselWrapper.querySelector('.slideRight');

        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            currentSlide = index;
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => {
                let nextIndex = currentSlide + 1;
                if (nextIndex >= slides.length) nextIndex = 0;
                showSlide(nextIndex);
            });
        }

        if (prevButton) {
            prevButton.addEventListener('click', () => {
                let prevIndex = currentSlide - 1;
                if (prevIndex < 0) prevIndex = slides.length - 1;
                showSlide(prevIndex);
            });
        }

        showSlide(0);
    });

});
