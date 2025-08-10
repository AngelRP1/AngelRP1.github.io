// Elementos del DOM
const slides    = Array.from(document.querySelectorAll('.carousel .slide'));
const track     = document.querySelector('.carousel');
const container = document.querySelector('.carousel-container');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
let currentIndex = 0;

// Detectar touch-capable device
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

// Si NO es touch, deshabilitamos scroll/drag visible y añadimos clase
if (!isTouchDevice) {
  track.classList.add('no-drag'); // CSS ocultará la barra y overflow
  // dejamos overflow hidden por JS también por compatibilidad
  track.style.overflowX = 'hidden';
} else {
  // para touch, permitimos overflow auto (ya está en CSS)
  track.style.overflowX = 'auto';
}

// Autoplay
let timer = setInterval(nextSlide, 20000);
function resetTimer() {
  clearInterval(timer);
  timer = setInterval(nextSlide, 20000);
}

// --- Helper: centra una slide por índice ---
// Nota: solo removemos is-flipped de slides distintas a idx, para conservar el estado flip de la activa
function centerSlideByIndex(idx, smooth = true) {
  const s = slides[idx];
  if (!s) return;
  const slideW = s.offsetWidth;
  const slideLeft = s.offsetLeft;
  const containerW = container.clientWidth;
  const target = Math.max(0, slideLeft + slideW / 2 - containerW / 2);
  track.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });

  slides.forEach((sl, i) => {
    sl.classList.toggle('active', i === idx);
    const inner = sl.querySelector('.card-inner');
    // solo removemos is-flipped en slides que NO sean la activa (así puedes volver a mostrar front con click)
    if (inner && i !== idx) inner.classList.remove('is-flipped');
  });
  currentIndex = idx;
}

// alias
function updateSlider() { centerSlideByIndex(currentIndex, true); }

// Avanzar y retroceder (wrap-around)
function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  centerSlideByIndex(currentIndex);
}
function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  centerSlideByIndex(currentIndex);
}

if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

// --- Soporte swipe (touch) con snap --- //
let isDragging = false;
let dragStartX = 0;
let startScroll = 0;
let movedDuringDrag = false; // para evitar flippings accidentales
const threshold = 50;

function onDragStart(clientX) {
  isDragging = true;
  movedDuringDrag = false;
  dragStartX = clientX;
  startScroll = track.scrollLeft;
  clearInterval(timer);
}
function onDragMove(clientX) {
  if (!isDragging) return;
  const dx = (dragStartX - clientX);
  if (Math.abs(dx) > 5) movedDuringDrag = true;
  track.scrollLeft = startScroll + dx;
}
function snapToNearestSlide(smooth = true) {
  const containerW = container.clientWidth;
  const centerX = track.scrollLeft + containerW / 2;
  let bestIndex = 0;
  let bestDist = Infinity;
  slides.forEach((s, i) => {
    const sCenter = s.offsetLeft + s.offsetWidth / 2;
    const dist = Math.abs(sCenter - centerX);
    if (dist < bestDist) {
      bestDist = dist;
      bestIndex = i;
    }
  });
  centerSlideByIndex(bestIndex, smooth);
}
function onDragEnd(clientX) {
  if (!isDragging) return;
  const delta = dragStartX - clientX;
  if (Math.abs(delta) > threshold) {
    if (delta > 0) nextSlide();
    else prevSlide();
  } else {
    snapToNearestSlide(true);
  }
  isDragging = false;
  setTimeout(() => { movedDuringDrag = false; }, 150);
  timer = setInterval(nextSlide, 20000);
}

// Attach only touch handlers for swipe (mobile)
if (isTouchDevice) {
  track.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), {passive: true});
  track.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), {passive: true});
  track.addEventListener('touchend', (e) => onDragEnd(e.changedTouches[0].clientX));
}

// Si quieres soporte de arrastrar con mouse en pantallas táctiles híbridas, podríamos condicionar más fino.
// Por ahora: NO añadimos mousedown/mousemove/mouseup para evitar la barra fea en desktop.

// Si el usuario usa scroll manual (touchpad) en dispositivos touch-capable, hacemos snap al detenerse.
function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
const debouncedSnap = debounce(() => { snapToNearestSlide(true); }, 120);
// Solo permitimos snap-from-scroll si el desplazamiento es posible (es decir, si no tenemos .no-drag)
if (!track.classList.contains('no-drag')) {
  track.addEventListener('scroll', debouncedSnap);
}

// --- Click en slide: centrarla y manejar flip (si está centrada) --- //
slides.forEach((slide, idx) => {
  const inner = slide.querySelector('.card-inner');
  slide.addEventListener('click', (e) => {
    if (movedDuringDrag) { movedDuringDrag = false; return; }
    // si no está centrada, la centramos; si ya centrada, permitimos flip según tu lógica
    if (currentIndex !== idx) {
      centerSlideByIndex(idx);
      resetTimer();
      return;
    }
    // Si era la activa, manejamos el flip (respeta .no-flip)
    if (!inner) return;
    if (slide.classList.contains('no-flip')) return;
    const isFlippable = slide.classList.contains('flippable') || (!!slide.querySelector('.card-back'));
    if (!isFlippable) return;
    inner.classList.toggle('is-flipped');
  });
});

// Inicializar al cargar y al redimensionar (centrar slide actual)
window.addEventListener('load', () => {
  requestAnimationFrame(() => centerSlideByIndex(currentIndex, false));
});
window.addEventListener('resize', () => {
  centerSlideByIndex(currentIndex, false);
});