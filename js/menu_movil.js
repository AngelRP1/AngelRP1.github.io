// js/menu_movil.js
(function () {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu   = document.getElementById('nav-menu');
  const mqMobile  = window.matchMedia('(max-width: 768px)');

  // Abre/cierra panel lateral en móvil
  function setMenu(open) {
    if (!navMenu) return;
    navMenu.classList.toggle('open', open);
    navToggle?.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : ''; // evita scroll del body
  }

  navToggle?.addEventListener('click', () => {
    setMenu(!navMenu.classList.contains('open'));
  });

  // Cerrar al tocar fuera del menú
  document.addEventListener('click', (e) => {
    if (!mqMobile.matches) return;
    if (!navMenu?.classList.contains('open')) return;

    const clickInsideMenu  = navMenu.contains(e.target);
    const clickOnToggle    = navToggle && (navToggle === e.target || navToggle.contains(e.target));

    if (!clickInsideMenu && !clickOnToggle) setMenu(false);
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('open')) setMenu(false);
  });

  // ----- Submenús -----
  const dropdownItems = document.querySelectorAll('#nav-menu .dropdown');

  dropdownItems.forEach((li) => {
    const link   = li.querySelector(':scope > a');
    const caret  = li.querySelector(':scope > a .dropdown-toggle-arrow');
    const submenu= li.querySelector(':scope > .submenu');

    if (!link || !submenu) return;

    // Estado aria
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');

    // Utilidad para abrir/cerrar
    const setOpen = (open) => {
      li.classList.toggle('open', open);
      link.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    // En DESKTOP dejamos el hover CSS tal como está
    // En MÓVIL: primer tap abre, segundo tap navega
    let tappedOnce = false;
    let tapTimer   = null;
    const TAP_RESET_MS = 600;

    const handleLinkTap = (e) => {
      if (!mqMobile.matches) return; // en desktop no intervenimos

      // Si aún NO está abierto, el primer tap ABRE y evitamos navegar
      if (!li.classList.contains('open')) {
        e.preventDefault();
        setOpen(true);
        tappedOnce = true;

        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { tappedOnce = false; }, TAP_RESET_MS);
        return;
      }

      // Si YA está abierto:
      // - Segundo tap en el link dentro de ventana -> deja navegar
      // - Tap fuera de ventana -> tratamos como primer tap de nuevo
      if (tappedOnce) {
        // dejar que el navegador siga el href
        tappedOnce = false;
        clearTimeout(tapTimer);
      } else {
        // lo tomamos como "primer tap" de nuevo: rearmamos ventana
        e.preventDefault();
        tappedOnce = true;
        clearTimeout(tapTimer);
        tapTimer = setTimeout(() => { tappedOnce = false; }, TAP_RESET_MS);
      }
    };

    // Click en la flecha SIEMPRE solo abre/cierra (no navega)
    const handleCaretTap = (e) => {
      if (!mqMobile.matches) return;
      e.preventDefault();
      e.stopPropagation();
      setOpen(!li.classList.contains('open'));
      tappedOnce = false;
      clearTimeout(tapTimer);
    };

    link.addEventListener('click', handleLinkTap);
    if (caret) {
      // Asegura que la flecha reciba eventos
      caret.style.pointerEvents = 'auto';
      caret.addEventListener('click', handleCaretTap);
      // Por si alguien toca justo el área del <i> icon
      caret.parentElement?.addEventListener('click', (ev) => {
        // si tocaron específicamente el icono, tratamos como caret
        if (ev.target === caret) handleCaretTap(ev);
      });
    }

    // Accesibilidad: Enter/Space abre/cierra en móvil
    link.addEventListener('keydown', (e) => {
      if (!mqMobile.matches) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(!li.classList.contains('open'));
      }
    });
  });

  // Reajusta cuando cambia el breakpoint (por si rotan pantalla)
  mqMobile.addEventListener('change', () => {
    // Cierra panel al pasar a desktop
    if (!mqMobile.matches) setMenu(false);
    // Resetea estados abiertos para evitar “quedar pegado”
    document.querySelectorAll('#nav-menu .dropdown.open').forEach(li => li.classList.remove('open'));
    document.querySelectorAll('#nav-menu .dropdown > a[aria-expanded="true"]').forEach(a => a.setAttribute('aria-expanded','false'));
  });
})();
