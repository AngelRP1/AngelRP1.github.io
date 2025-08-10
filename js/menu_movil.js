// menu_movil.js - toggle menú y submenus (desktop hover + mobile click)

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const dropdownItems = Array.from(document.querySelectorAll('.top-nav .dropdown'));

  // Toggle principal (botón hamburger)
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function (e) {
      navMenu.classList.toggle('open');
      // accesibilidad: actualizar aria-expanded
      const expanded = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  // Para cada dropdown: en móvil (<=768) usar click para abrir/cerrar
  function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  dropdownItems.forEach(item => {
    const trigger = item.querySelector('a'); // link principal
    // Prevent default on parent link if it only acts as a toggle in mobile
    trigger.addEventListener('click', function (e) {
      if (isMobileView()) {
        // evita navegación si el enlace es sólo para desplegar (si quieres mantener enlace, quita preventDefault)
        e.preventDefault();
        item.classList.toggle('open');
      }
    });

    // accesibilidad: toggle con tecla Enter/Space cuando está enfocado
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (isMobileView()) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      }
    });
  });

  // Cerrar submenus al cambiar de tamaño si pasamos a desktop
  window.addEventListener('resize', function () {
    if (!isMobileView()) {
      // asegurarse que #nav-menu esté visible en desktop y limpiar clases open
      if (navMenu) navMenu.classList.remove('open');
      dropdownItems.forEach(it => it.classList.remove('open'));
    }
  });
});
