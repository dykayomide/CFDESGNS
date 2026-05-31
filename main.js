/* ==========================================
   CFDESGNS — Main JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── CUSTOM CURSOR ──
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const animCursor = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      dot.style.left  = mx + 'px';
      dot.style.top   = my + 'px';
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animCursor);
    };
    animCursor();
  }

  // ── NAV SCROLL ──
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  // ── HAMBURGER / MOBILE MENU ──
  const hamburger   = document.querySelector('.hamburger');
  const mobileMenu  = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      })
    );
  }

  // ── ACTIVE NAV LINK ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── QUOTE MODAL ──
  const modal         = document.getElementById('quoteModal');
  const modalTriggers = document.querySelectorAll('[data-quote]');
  const modalClose    = document.querySelector('.modal-close');

  modalTriggers.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // ── LIGHTBOX ──
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const lbClose      = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const lbPrev       = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const lbNext       = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  let currentImages  = [];
  let currentIndex   = 0;

  function openLightbox(images, index) {
    if (!lightbox || !lightboxImg) return;
    currentImages = images;
    currentIndex  = index;
    lightboxImg.src = currentImages[currentIndex];
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showLBImage(i) {
    currentIndex = (i + currentImages.length) % currentImages.length;
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = currentImages[currentIndex];
      lightboxImg.style.opacity = '1';
    }, 150);
    lightboxImg.style.transition = 'opacity 0.15s';
  }

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  if (lbPrev) lbPrev.addEventListener('click', () => showLBImage(currentIndex - 1));
  if (lbNext) lbNext.addEventListener('click', () => showLBImage(currentIndex + 1));

  document.addEventListener('keydown', e => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  showLBImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showLBImage(currentIndex + 1);
    if (e.key === 'Escape')     closeLightbox();
  });

  // Attach lightbox to portfolio items
  function attachLightbox() {
    const sections = document.querySelectorAll('.portfolio-grid');
    sections.forEach(section => {
      const items = [...section.querySelectorAll('.portfolio-item:not(.placeholder)')];
      const images = items.map(item => item.querySelector('img')?.src).filter(Boolean);
      items.forEach((item, i) => {
        item.addEventListener('click', () => openLightbox(images, i));
      });
    });
  }
  attachLightbox();

  // ── SCROLL REVEAL ──
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  // ── MARQUEE DUPLICATE ──
  const track = document.querySelector('.marquee-track');
  if (track) {
    track.innerHTML += track.innerHTML;
  }

  // ── COUNT-UP ANIMATION ──
function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCountUp(el) {
  const rawText  = el.dataset.target;
  const numMatch = rawText.match(/^(\d+\.?\d*)(.*)/);
  if (!numMatch) return; // handles symbols like ∞
  const target   = parseFloat(numMatch[1]);
  const suffix   = numMatch[2] || '';
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeOutExpo(progress);
    const current  = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('.stat-num');
if (statNums.length) {
  statNums.forEach(el => {
    el.dataset.target = el.textContent.trim();
    if (/\d/.test(el.dataset.target)) el.textContent = '0';
  });

  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCountUp(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => {
    if (/\d/.test(el.dataset.target)) countObserver.observe(el);
  });
}

// ── HOVER-TO-PLAY VIDEO (video-flyers page) ──
document.querySelectorAll('.video-item, .portfolio-item[data-video]').forEach(item => {
  const videoSrc = item.dataset.video;
  if (!videoSrc) return;

  const vid = document.createElement('video');
  vid.src         = videoSrc;
  vid.muted       = true;
  vid.loop        = true;
  vid.playsInline = true;
  vid.preload     = 'none';
  vid.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: 1;
  `;
  item.appendChild(vid);

  item.addEventListener('mouseenter', () => {
    vid.style.opacity = '1';
    vid.play().catch(() => {});
  });
  item.addEventListener('mouseleave', () => {
    vid.style.opacity = '0';
    vid.pause();
    vid.currentTime = 0;
  });
});

  // ── FILTER TABS (portfolio pages) ──
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.filter;
      document.querySelectorAll('.portfolio-item').forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

});
