// Navigation einfügen
document.addEventListener("DOMContentLoaded", function () {
    fetch("navbar.html").then(res => res.text()).then(data => {
        document.getElementById("navbar").innerHTML = data;
        setupNavToggle();
    });

    fetch("footer.html").then(res => res.text()).then(data => {
        document.getElementById("footer").innerHTML = data;
    });

    setupCarousel();
});

// Hamburger Menü
function setupNavToggle() {
    const toggleButton = document.getElementById("nav-toggle");
    const menu = document.querySelector(".navbar-links");

    toggleButton.addEventListener("click", function () {
        menu.classList.toggle("show");
    });
}

// Carousel Funktion
function setupCarousel() {
    const slides = document.querySelectorAll(".carousel-slide");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    let index = 0;

    function showSlide(n) {
        index = (n + slides.length) % slides.length;
        document.querySelector(".carousel-container").style.transform = `translateX(-${index * 100}%)`;
    }

    prevButton.addEventListener("click", () => showSlide(index - 1));
    nextButton.addEventListener("click", () => showSlide(index + 1));
}
