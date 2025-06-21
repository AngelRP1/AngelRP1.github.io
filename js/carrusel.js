
// Elementos del DOM
const slides    = Array.from(document.querySelectorAll('.carousel .slide'));
const track     = document.querySelector('.carousel');
const container = document.querySelector('.carousel-container');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
let currentIndex = 0;

// Centra el slide activo usando offsetLeft
function updateSlider() {
    const activeSlide = slides[currentIndex];
    const slideW      = activeSlide.offsetWidth;
    const containerW  = container.clientWidth;
    const slideLeft   = activeSlide.offsetLeft;

    // Queremos desplazar de modo que activeSlide quede centrado
    const centerOffset = (containerW - slideW) / 2;
    const shift        = -slideLeft + centerOffset;

    track.style.transform = `translateX(${shift}px)`;

    // Marca la clase active para escalar
    slides.forEach((s, i) => s.classList.toggle('active', i === currentIndex));
}

// Handlers de botones
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
});
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSlider();
});

// Auto-play con pausa al hover
let timer = setInterval(() => nextBtn.click(), 4000);
container.addEventListener('mouseenter', () => clearInterval(timer));
container.addEventListener('mouseleave', () => {
    timer = setInterval(() => nextBtn.click(), 4000);
});

    // Flip de tarjetas
    slides.forEach(sl => {
        const inner = sl.querySelector('.card-inner');
    if (inner) {
        inner.addEventListener('click', e => {
            e.currentTarget.classList.toggle('flipped');
        });
    }
});

// — Swipe en móvil —
let startX = 0;
let isDragging = false;

track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
    clearInterval(timer); // pausa el autoplay
});

track.addEventListener('touchend', e => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    const threshold = container.clientWidth * 0.2; // mínimo 20% del ancho para considerar swipe

    if (delta > threshold) {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length; // swipe a la derecha
    } else if (delta < -threshold) {
        currentIndex = (currentIndex + 1) % slides.length; // swipe a la izquierda
    }
    updateSlider();
    isDragging = false;
    timer = setInterval(nextSlide, 4000); // reanuda autoplay
});

// Inicializar al cargar y al redimensionar
window.addEventListener('load', updateSlider);
window.addEventListener('resize', updateSlider);
