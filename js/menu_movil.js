
const btn = document.getElementById('nav-toggle');
const menu = document.getElementById('nav-menu');
btn.addEventListener('click', () => {
    menu.classList.toggle('open');
});
