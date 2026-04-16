/* ============================================================
   Two Trim — Theme JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* --- Mobile Menu --- */
  const menuBtn = document.querySelector('.header__menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuClose = document.querySelector('.mobile-menu__close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
    menuClose?.addEventListener('click', closeMobileMenu);
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) closeMobileMenu();
    });
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* --- Cart Drawer --- */
  const cartBtns = document.querySelectorAll('[data-cart-toggle]');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartOverlay = document.querySelector('.cart-drawer__overlay');
  const cartClose = document.querySelector('.cart-drawer__close');

  cartBtns.forEach((btn) =>
    btn.addEventListener('click', () => toggleCart(true))
  );
  cartClose?.addEventListener('click', () => toggleCart(false));
  cartOverlay?.addEventListener('click', () => toggleCart(false));

  function toggleCart(open) {
    cartDrawer?.classList.toggle('is-open', open);
    cartOverlay?.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  /* --- Product Thumbnails --- */
  const thumbs = document.querySelectorAll('.product__thumb');
  const mainImg = document.querySelector('.product__main-image img');

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach((t) => t.classList.remove('is-active'));
      thumb.classList.add('is-active');
      if (mainImg) {
        mainImg.src = thumb.dataset.full || thumb.querySelector('img')?.src;
        mainImg.srcset = '';
      }
    });
  });

  /* --- Variant Selector --- */
  const variantBtns = document.querySelectorAll('.product__variant-btn');

  variantBtns.forEach((btn) => {
    if (btn.classList.contains('is-soldout')) return;
    btn.addEventListener('click', () => {
      const group = btn.closest('.product__variant-options');
      group
        .querySelectorAll('.product__variant-btn')
        .forEach((b) => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');

      // Update hidden variant input
      updateSelectedVariant();
    });
  });

  function updateSelectedVariant() {
    const selected = document.querySelectorAll(
      '.product__variant-btn.is-selected'
    );
    const variantInput = document.querySelector('[name="id"]');
    const variantData = window.twotrimVariants || [];
    if (!variantInput || !variantData.length) return;

    const opts = Array.from(selected).map((b) => b.dataset.value);
    const match = variantData.find(
      (v) =>
        v.options.length === opts.length &&
        v.options.every((o, i) => o === opts[i])
    );

    if (match) {
      variantInput.value = match.id;
      // Update price display
      const priceEl = document.querySelector('.product__price');
      if (priceEl) priceEl.textContent = match.priceFormatted;
    }
  }

  /* --- Size Guide Modal --- */
  const sizeToggle = document.querySelector('.product__size-guide-toggle');
  const sizeModal = document.querySelector('.size-guide-modal');
  const sizeClose = document.querySelector('.size-guide-modal__close');

  sizeToggle?.addEventListener('click', () =>
    sizeModal?.classList.add('is-open')
  );
  sizeClose?.addEventListener('click', () =>
    sizeModal?.classList.remove('is-open')
  );
  sizeModal?.addEventListener('click', (e) => {
    if (e.target === sizeModal) sizeModal.classList.remove('is-open');
  });

  /* --- FAQ Accordion --- */
  document.querySelectorAll('.faq__question').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq__item');
      const wasOpen = item.classList.contains('is-open');
      // Close all
      document
        .querySelectorAll('.faq__item')
        .forEach((i) => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  /* --- Carousel Navigation --- */
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('.carousel__nav--prev');
    const next = carousel.querySelector('.carousel__nav--next');
    if (!track) return;

    const scrollAmt = () => track.offsetWidth * 0.75;
    prev?.addEventListener('click', () =>
      track.scrollBy({ left: -scrollAmt(), behavior: 'smooth' })
    );
    next?.addEventListener('click', () =>
      track.scrollBy({ left: scrollAmt(), behavior: 'smooth' })
    );
  });

  /* --- Sticky Add to Cart visibility --- */
  const stickyATC = document.querySelector('.product__sticky-atc');
  const addToCartBtn = document.querySelector('.product__add-to-cart');

  if (stickyATC && addToCartBtn) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        stickyATC.style.transform = entry.isIntersecting
          ? 'translateY(100%)'
          : 'translateY(0)';
      },
      { threshold: 0 }
    );
    stickyATC.style.transition = 'transform .3s ease';
    observer.observe(addToCartBtn);
  }

  /* --- Exit Intent Popup --- */
  const exitPopup = document.querySelector('.exit-popup');
  const exitClose = document.querySelector('.exit-popup__close');
  let exitShown = sessionStorage.getItem('tt_exit_shown');

  if (exitPopup && !exitShown) {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitShown) {
        exitPopup.classList.add('is-open');
        exitShown = true;
        sessionStorage.setItem('tt_exit_shown', '1');
      }
    });

    // Mobile: show after 30s on page
    if (window.innerWidth < 768) {
      setTimeout(() => {
        if (!exitShown) {
          exitPopup.classList.add('is-open');
          exitShown = true;
          sessionStorage.setItem('tt_exit_shown', '1');
        }
      }, 30000);
    }
  }

  exitClose?.addEventListener('click', () =>
    exitPopup?.classList.remove('is-open')
  );
  exitPopup?.addEventListener('click', (e) => {
    if (e.target === exitPopup) exitPopup.classList.remove('is-open');
  });

  /* --- Lazy Loading (native with fallback) --- */
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      if (img.dataset.src) img.src = img.dataset.src;
    });
  } else {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          img.classList.add('lazyloaded');
          lazyObserver.unobserve(img);
        }
      });
    });
    document
      .querySelectorAll('img[data-src]')
      .forEach((img) => lazyObserver.observe(img));
  }

  /* --- Add to Cart (AJAX) --- */
  document.querySelectorAll('form[action="/cart/add"]').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const origText = btn?.textContent;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Adding...';
      }

      try {
        const formData = new FormData(form);
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          if (btn) btn.textContent = 'Added ✓';
          toggleCart(true);
          refreshCart();
        } else {
          if (btn) btn.textContent = 'Error';
        }
      } catch {
        if (btn) btn.textContent = 'Error';
      }

      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.textContent = origText;
        }
      }, 2000);
    });
  });

  async function refreshCart() {
    try {
      const res = await fetch('/cart.js');
      const cart = await res.json();
      // Update cart count badges
      document.querySelectorAll('.header__cart-count').forEach((el) => {
        el.textContent = cart.item_count;
        el.style.display = cart.item_count > 0 ? 'flex' : 'none';
      });
      // Update cart drawer body
      const body = document.querySelector('.cart-drawer__body');
      if (!body) return;

      if (cart.items.length === 0) {
        body.innerHTML =
          '<div class="cart-drawer__empty"><p>Your cart is empty</p></div>';
        return;
      }

      body.innerHTML = cart.items
        .map(
          (item) => `
        <div class="cart-drawer__item">
          <div class="cart-drawer__item-img">
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>
          <div class="cart-drawer__item-info">
            <div class="cart-drawer__item-title">${item.product_title}</div>
            <div class="cart-drawer__item-variant">${item.variant_title || ''}</div>
            <div class="cart-drawer__item-price">€${(item.final_line_price / 100).toFixed(2)}</div>
            <div class="cart-drawer__qty">
              <button onclick="updateQty(${item.key}, ${item.quantity - 1})">−</button>
              <span>${item.quantity}</span>
              <button onclick="updateQty(${item.key}, ${item.quantity + 1})">+</button>
            </div>
          </div>
        </div>
      `
        )
        .join('');

      // Update total
      const totalEl = document.querySelector('.cart-drawer__total-price');
      if (totalEl)
        totalEl.textContent = `€${(cart.total_price / 100).toFixed(2)}`;

      // Update shipping note
      const FREE_SHIP = 5000; // 50€ in cents
      const noteEl = document.querySelector('.cart-drawer__shipping-note');
      if (noteEl) {
        const remaining = FREE_SHIP - cart.total_price;
        noteEl.textContent =
          remaining > 0
            ? `Add €${(remaining / 100).toFixed(2)} more for free shipping`
            : 'You qualify for free shipping!';
      }
    } catch {
      /* silent */
    }
  }

  // Global qty updater
  window.updateQty = async function (key, qty) {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: String(key), quantity: Math.max(0, qty) }),
    });
    refreshCart();
  };

  // Initial cart load
  refreshCart();
})();
