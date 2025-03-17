document.addEventListener("DOMContentLoaded", function () {
    // Navigation einfügen
    fetch("navbar.html").then(res => res.text()).then(data => {
        document.getElementById("navbar").innerHTML = data;
        setupNavToggle();
    });

    fetch("footer.html").then(res => res.text()).then(data => {
        document.getElementById("footer").innerHTML = data;
    });

    setupCarousel();
    renderCalendar(currentMonth, currentYear);
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
// JavaScript für das Text-Carousel
window.textCarousel = (() => {
    const carouselTrack = document.querySelector('.text-carousel-track');
    const slides = document.querySelectorAll('.text-carousel-div');
    const radioButtons = document.querySelectorAll('input[name="text-slider"]');

    if (!carouselTrack || slides.length === 0 || radioButtons.length === 0) {
        console.warn("Carousel-Elemente nicht gefunden oder unvollständig.");
        return; // Beende die Funktion, falls essentielle Elemente fehlen
    }

    let currentSlideIndex = 0;

    // Funktion zum Wechseln der Slides
    const updateSlide = (index) => {
        // Sicherstellen, dass der Index innerhalb des gültigen Bereichs liegt
        if (index < 0) {
            index = slides.length - 1; // Gehe zum letzten Slide
        } else if (index >= slides.length) {
            index = 0; // Gehe zum ersten Slide
        }

        // Aktualisiere die Position des Tracks
        const slideWidth = slides[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${index * slideWidth}px)`;

        // Aktualisiere den aktiven Radio-Button
        radioButtons[index].checked = true;

        // Aktualisiere den aktuellen Slide-Index
        currentSlideIndex = index;
    };

    // Funktion für den vorherigen Slide
    const prevSlide = () => {
        updateSlide(currentSlideIndex - 1);
    };

    // Funktion für den nächsten Slide
    const nextSlide = () => {
        updateSlide(currentSlideIndex + 1);
    };

    // Event Listener für die Radio-Buttons
    radioButtons.forEach((button, index) => {
        button.addEventListener('change', () => {
            updateSlide(index);
        });
    });

    // Initiale Position setzen
    updateSlide(currentSlideIndex);

    return { prevSlide, nextSlide };
})();

// Kalender-Funktionen
const calendarDates = document.querySelector('.calendar-dates');
const monthYear = document.getElementById('month-year');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const timeContainer = document.querySelector('.freienTermine');
const form = document.querySelector("form");
const alertDangerEl = document.querySelector('.alert-danger');
const fullyBookedblock = document.querySelector('.alert-fullyBooked');
const submitButton = document.getElementById("submitButton");
const inputs = {
    vorname: document.getElementById("vorname"),
    nachname: document.getElementById("nachname"),
    email: document.getElementById("email"),
    telefonnummer: document.getElementById("telefonnummer"),
    message: document.getElementById("message")
};

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDay = null;
let selectedDate = localStorage.getItem("selectedDate") || "";
let selectedTime = localStorage.getItem("selectedTime") || "";
let userData = JSON.parse(localStorage.getItem("userData")) || [];

const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

function renderCalendar(month, year) {
    calendarDates.innerHTML = '';
    monthYear.textContent = `${months[month]} ${year}`;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().setHours(0, 0, 0, 0);
    
    Array.from({ length: firstDayOfMonth }).forEach(() => calendarDates.appendChild(document.createElement('div')));
    
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        const date = new Date(year, month, i).setHours(0, 0, 0, 0);
        const formattedDate = `${i}.${month + 1}.${year}`;
        day.textContent = i;
        if (date === today) day.classList.add('current-date');
        if (date < today) day.classList.add('last-date');
        if (new Date(date).getDay() === 0) day.classList.add('holiday-date');

        let isAvailable = date >= today && date <= new Date(today).setMonth(new Date(today).getMonth() + 2) && !day.classList.contains('holiday-date');
        if (isAvailable) day.classList.add('available-date');
        if (isFullyBooked(formattedDate)) day.classList.add('fully-booked');
        
        calendarDates.appendChild(day);
    }
}

function isFullyBooked(date) {
    const totalSlots = generateTimeSlots();
    const bookedSlotsCount = userData.filter(entry => entry.date === date).length;
    return bookedSlotsCount >= totalSlots.length;
}

function generateTimeSlots(slots = [{ start: 10, end: 12 }, { start: 17, end: 19 }]) {
    return slots.flatMap(slot => {
        const slotsArray = [];
        for (let i = slot.start; i < slot.end; i++) {
            slotsArray.push(`${i}:00 - ${i + 1}:00 Uhr`);
        }
        return slotsArray;
    });
}

function validateForm() {
    return Object.values(inputs).every(input => input.value.trim());
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateForm()) {
        alertDangerEl.textContent = "Bitte füllen Sie alle Felder aus.";
        alertDangerEl.style.display = "block";
        return;
    }

    if (!selectedDate || !selectedTime) {
        alertDangerEl.textContent = "Bitte wählen Sie ein Datum und eine Uhrzeit aus.";
        alertDangerEl.style.display = "block";
        return;
    }

    const url = `confirmation.html?name=${encodeURIComponent(inputs.vorname.value.trim())}&date=${encodeURIComponent(selectedDate)}&time=${encodeURIComponent(selectedTime)}&email=${encodeURIComponent(inputs.email.value.trim())}&phone=${encodeURIComponent(inputs.telefonnummer.value.trim())}&message=${encodeURIComponent(inputs.message.value.trim())}`;
    window.location.href = url;

    userData.push({ date: selectedDate, time: selectedTime });
    localStorage.setItem("userData", JSON.stringify(userData));
    renderCalendar(currentMonth, currentYear);
    
    selectedDate = "";
    selectedTime = "";
    localStorage.removeItem("selectedDate");
    localStorage.removeItem("selectedTime");
    submitButton.disabled = true;
});

prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
});


