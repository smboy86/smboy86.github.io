const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle('is-active', item === button));
    projectCards.forEach((card) => {
      const categories = card.dataset.category?.split(' ') ?? [];
      card.classList.toggle('is-hidden', filter !== 'all' && !categories.includes(filter));
    });
  });
});

document.querySelectorAll('.product-gallery').forEach((gallery) => {
  const slides = [...gallery.querySelectorAll('.product-slide')];
  const counter = gallery.querySelector('.product-gallery-count');
  let current = 0;
  let touchStart = null;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== current; });
    counter.textContent = `${current + 1} / ${slides.length}`;
  };

  gallery.querySelectorAll('[data-gallery-step]').forEach((button) => {
    button.addEventListener('click', () => {
      showSlide(current + Number(button.dataset.galleryStep));
    });
  });
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showSlide(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  gallery.addEventListener('touchstart', (event) => {
    touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  gallery.addEventListener('touchend', (event) => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      showSlide(current + (dx < 0 ? 1 : -1));
    }
    touchStart = null;
  }, { passive: true });
  gallery.addEventListener('touchcancel', () => { touchStart = null; });
});
