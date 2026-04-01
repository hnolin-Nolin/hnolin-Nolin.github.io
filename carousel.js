// Carousel functionality for fading between images
document.addEventListener('DOMContentLoaded', function() {
    // Get all slide elements and navigation buttons
    const slides = document.querySelectorAll(".slide");
    const prevButton = document.getElementById("slideLeft");
    const nextButton = document.getElementById("slideRight");

    let currentSlide = 0;

    // Function to show a specific slide by index
    function showSlide(index) {
        // Loop through all slides and toggle the 'active' class
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active'); // Show this slide
            } else {
                slide.classList.remove('active'); // Hide others
            }
        });
        currentSlide = index; // Update current slide index
    }

    // Event listener for next button
    nextButton.addEventListener("click", () => {
        let nextIndex = currentSlide + 1;
        if (nextIndex >= slides.length) nextIndex = 0; // Loop back to first
        showSlide(nextIndex);
    });

    // Event listener for previous button
    prevButton.addEventListener("click", () => {
        let prevIndex = currentSlide - 1;
        if (prevIndex < 0) prevIndex = slides.length - 1; // Loop to last
        showSlide(prevIndex);
    });

    // Show first slide initially
    showSlide(0);
});
