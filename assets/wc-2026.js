/* ============================================================
   Two Trim — World Cup 2026 Kit Gallery
   Handles: home/away toggle, zoom-on-hover, mobile swipe
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     KIT GALLERY — Product page component
     Expects data attributes on .kit-gallery:
       data-home-img  = URL of home kit image (large)
       data-away-img  = URL of away kit image (large)
     ---------------------------------------------------------- */

  const gallery = document.querySelector('.kit-gallery');
  if (!gallery) return;

  const mainImg = gallery.querySelector('.kit-gallery__main-img');
  const zoomEl = gallery.querySelector('.kit-gallery__zoom');
  const badge = gallery.querySelector('.kit-gallery__badge');
  const toggles = gallery.querySelectorAll('.kit-gallery__toggle');
  const dots = gallery.querySelectorAll('.kit-gallery__dot');
  const swipeHint = gallery.querySelector('.kit-gallery__swipe-hint');
  const thumbs = gallery.querySelectorAll('.kit-gallery__thumb');

  const homeImg = gallery.dataset.homeImg || '';
  const awayImg = gallery.dataset.awayImg || '';

  let currentKit = 'home'; // Track active state

  /* --- Switch between home and away --- */
  function switchKit(kit) {
    if (kit === currentKit) return;
    currentKit = kit;

    const imgUrl = kit === 'home' ? homeImg : awayImg;
    if (!imgUrl || !mainImg) return;

    // Fade transition
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = imgUrl;
      mainImg.alt = kit === 'home' ? 'Home Kit' : 'Away Kit';
      mainImg.style.opacity = '1';

      // Update zoom background
      if (zoomEl) {
        zoomEl.style.backgroundImage = `url(${imgUrl})`;
      }
    }, 150);

    // Update badge
    if (badge) {
      badge.textContent = kit === 'home' ? 'Home' : 'Away';
      badge.className = `kit-gallery__badge kit-gallery__badge--${kit}`;
    }

    // Update toggle buttons
    toggles.forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.kit === kit);
    });

    // Update dot indicators
    dots.forEach((dot) => {
      dot.classList.toggle('is-active', dot.dataset.kit === kit);
    });

    // Update thumbs
    thumbs.forEach((thumb) => {
      thumb.classList.toggle('is-active', thumb.dataset.kit === kit);
    });
  }

  /* --- Toggle button click handlers --- */
  toggles.forEach((btn) => {
    btn.addEventListener('click', () => switchKit(btn.dataset.kit));
  });

  /* --- Dot click handlers --- */
  dots.forEach((dot) => {
    dot.addEventListener('click', () => switchKit(dot.dataset.kit));
  });

  /* --- Thumbnail click handlers --- */
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => switchKit(thumb.dataset.kit));
  });

  /* ----------------------------------------------------------
     ZOOM ON HOVER (desktop only)
     Moves a 2x background-image to follow the cursor
     ---------------------------------------------------------- */

  const mainWrap = gallery.querySelector('.kit-gallery__main');

  if (mainWrap && zoomEl && window.matchMedia('(hover: hover)').matches) {
    // Set initial zoom image
    zoomEl.style.backgroundImage = `url(${homeImg})`;

    mainWrap.addEventListener('mousemove', (e) => {
      const rect = mainWrap.getBoundingClientRect();
      // Calculate cursor position as percentage
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      zoomEl.style.backgroundPosition = `${x}% ${y}%`;
    });

    mainWrap.addEventListener('mouseenter', () => {
      zoomEl.style.opacity = '1';
    });

    mainWrap.addEventListener('mouseleave', () => {
      zoomEl.style.opacity = '0';
    });
  }

  /* ----------------------------------------------------------
     MOBILE SWIPE SUPPORT
     Swipe left = away kit, swipe right = home kit
     ---------------------------------------------------------- */

  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50; // Minimum px to register as swipe

  if (mainWrap) {
    mainWrap.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    mainWrap.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) >= SWIPE_THRESHOLD) {
          if (diff > 0) {
            // Swiped left → show away
            switchKit('away');
          } else {
            // Swiped right → show home
            switchKit('home');
          }
        }

        // Hide swipe hint after first swipe
        if (swipeHint && Math.abs(diff) >= SWIPE_THRESHOLD) {
          swipeHint.classList.add('is-hidden');
        }
      },
      { passive: true }
    );
  }

  /* --- Keyboard support: arrow keys toggle kits --- */
  if (mainWrap) {
    mainWrap.setAttribute('tabindex', '0');
    mainWrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') switchKit('home');
      if (e.key === 'ArrowRight') switchKit('away');
    });
  }
})();
