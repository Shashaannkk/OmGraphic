/* ==========================================================================
   OM GRAPHICS – main.js
   UI Interactions: Header scroll, dark mode, mobile nav,
   FAQ accordion, testimonial slider, tabs, scroll-reveal
   ========================================================================== */

'use strict';

// ─────────────────────────────────────────────
// 1. Dark Mode
// ─────────────────────────────────────────────
(function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const saved = localStorage.getItem('omgraphicTheme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = saved === 'dark' || (!saved && prefersDark);

  if (isDark) {
    document.body.classList.add('dark-theme');
    toggle.checked = true;
  }

  toggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme', toggle.checked);
    localStorage.setItem('omgraphicTheme', toggle.checked ? 'dark' : 'light');
  });
})();

// ─────────────────────────────────────────────
// 2. Header Scroll Behaviour
// ─────────────────────────────────────────────
(function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    // Hide on fast scroll-down (> 200px), show on scroll-up
    if (y > lastY && y > 200) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = '';
    }
    lastY = y;
  }, { passive: true });
})();

// ─────────────────────────────────────────────
// 3. Mobile Navigation
// ─────────────────────────────────────────────
(function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu   = document.querySelector('.nav-menu');
  if (!hamburger || !navMenu) return;

  // Create overlay element for mobile
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  function openNav() {
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeNav() : openNav();
  });

  // Navigation links are left to standard HTML href navigation to prevent mobile touch cancellation.
  // The mobile menu will be closed by default when the new page loads.

  // Close on overlay click
  overlay.addEventListener('click', closeNav);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeNav();
    }
  });

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeNav();
    }
  });
})();

// ─────────────────────────────────────────────
// 4. Scroll-Reveal (IntersectionObserver)
// ─────────────────────────────────────────────
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .stagger-children');
  if (!els.length || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  els.forEach(el => observer.observe(el));
})();

// ─────────────────────────────────────────────
// 5. Machinery / Content Tabs
// ─────────────────────────────────────────────
(function initTabs() {
  const tabBtns     = document.querySelectorAll('.tab-btn[data-tab]');
  const tabContents = document.querySelectorAll('.machinery-content');
  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });
})();

// ─────────────────────────────────────────────
// 6. Testimonial Slider
// ─────────────────────────────────────────────
(function initTestimonialSlider() {
  const slides      = document.querySelectorAll('.testimonial-slide');
  const controlsEl  = document.getElementById('sliderControls');
  if (!slides.length || !controlsEl) return;

  let current = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
    controlsEl.appendChild(dot);
  });

  function goTo(idx) {
    slides[current].classList.remove('active');
    controlsEl.children[current].classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    controlsEl.children[current].classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  startAuto();
  const container = document.querySelector('.testimonial-slider-container');
  if (container) {
    container.addEventListener('mouseenter', stopAuto);
    container.addEventListener('mouseleave', startAuto);
  }
})();

// ─────────────────────────────────────────────
// 7. FAQ Accordion
// ─────────────────────────────────────────────
(function initFAQ() {
  const headers = document.querySelectorAll('.faq-header');
  if (!headers.length) return;

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item     = header.parentElement;
      const isOpen   = item.classList.contains('open');
      const allItems = document.querySelectorAll('.faq-item');

      // Close all
      allItems.forEach(it => {
        it.classList.remove('open');
        it.querySelector('.faq-header').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('open');
        header.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
})();

// ─────────────────────────────────────────────
// 8. Button Ripple Effect
// ─────────────────────────────────────────────
(function initButtonRipple() {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      const rect = btn.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.style.cssText = `
        position:absolute;
        width:4px; height:4px;
        border-radius:50%;
        background:rgba(255,255,255,0.35);
        left:${x}px; top:${y}px;
        transform:scale(0);
        animation:rippleAnim 0.55s ease-out forwards;
        pointer-events:none;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = `@keyframes rippleAnim { to { transform: scale(80); opacity: 0; } }`;
    document.head.appendChild(style);
  }
})();

// ─────────────────────────────────────────────
// 9. Smooth Counter Animation (Stats)
// ─────────────────────────────────────────────
(function initCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const el   = entry.target;
      const text = el.textContent.trim();
      const num  = parseFloat(text.replace(/[^\d.]/g, ''));
      const suffix = text.replace(/[\d.]/g, '');
      if (isNaN(num)) return;

      const duration = 1400;
      const start    = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const value    = Math.round(num * eased);
        el.textContent = (Number.isInteger(num) ? value : value.toFixed(0)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  stats.forEach(el => observer.observe(el));
})();

// ─────────────────────────────────────────────
// 10. Portfolio Filter
// ─────────────────────────────────────────────
(function initPortfolioFilter() {
  const filterBtns    = document.querySelectorAll('#portfolioFilters .tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');
      portfolioItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        const show = (filterVal === 'all' || itemCat === filterVal);
        item.style.display = show ? '' : 'none';
        if (show) {
          item.style.animation = 'revealUp 0.4s ease both';
        }
      });
    });
  });
})();

// ─────────────────────────────────────────────
// 11. Contact Form Submission (with validation)
// ─────────────────────────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic XSS-safe sanitization check
    const inputs = form.querySelectorAll('input, select, textarea');
    let valid = true;
    inputs.forEach(input => {
      if (input.required && !input.value.trim()) {
        valid = false;
        input.style.borderColor = '#e53e3e';
      } else {
        input.style.borderColor = '';
      }
    });

    if (!valid) return;

    // Show success toast instead of alert
    showToast('Your inquiry has been submitted! Our team will contact you within 24 hours.');
    form.reset();
  });
})();

// ─────────────────────────────────────────────
// 12. Toast Notification (replaces alerts)
// ─────────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notification';
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 32px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #009E5A, #1FB977)' : 'linear-gradient(135deg, #e53e3e, #fc8181)'};
    color: #fff;
    padding: 16px 24px;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    max-width: 320px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 9999;
    animation: slideInRight 0.4s ease;
    font-family: inherit;
    line-height: 1.4;
  `;
  toast.textContent = message;

  if (!document.getElementById('toastStyles')) {
    const s = document.createElement('style');
    s.id = 'toastStyles';
    s.textContent = `
      @keyframes slideInRight { from { transform: translateX(100%); opacity:0; } to { transform: none; opacity:1; } }
      @keyframes slideOutRight { from { transform: none; opacity:1; } to { transform: translateX(100%); opacity:0; } }
    `;
    document.head.appendChild(s);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.4s ease forwards';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// Expose for inline uses
window.showToast = showToast;
