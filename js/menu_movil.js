document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const dropdownItems = Array.from(document.querySelectorAll('.top-nav .dropdown'));

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function (e) {
      navMenu.classList.toggle('open');
      const expanded = navMenu.classList.contains('open');
      navToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  }

  function isMobileView() {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  dropdownItems.forEach(item => {
    const link = item.querySelector('a');
    const arrow = item.querySelector('.dropdown-toggle-arrow');

    // Evitar toggle al hacer click en el texto
    link.addEventListener('click', function(e) {
      if (isMobileView()) {
        e.preventDefault(); // si quieres que no navegue, sino solo toggle con flecha
      }
    });

    // Toggle solo al presionar la flecha
    if (arrow) {
      arrow.addEventListener('click', function(e) {
        e.stopPropagation();
        item.classList.toggle('open');
      });
    }
  });

  window.addEventListener('resize', function () {
    if (!isMobileView()) {
      if (navMenu) navMenu.classList.remove('open');
      dropdownItems.forEach(it => it.classList.remove('open'));
    }
  });
});