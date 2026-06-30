(function () {
  var page = document.body.dataset.page || '';
  var isHome = page === 'home';
  var contactHref = isHome ? '#contact' : 'index.html#contact';

  var activeNav = {
    home: ['home'],
    shop: ['shop'],
    about: ['about'],
    blog: ['blog'],
    track: ['track'],
    cart: ['cart'],
    signup: [],
    'daily-sip': ['shop'],
    refreshica: ['shop']
  };

  var productMobileLinks = {
    'daily-sip': { href: 'product-daily-sip.html', label: 'Daily Sip' },
    refreshica: { href: 'product-refreshica.html', label: 'Refreshica' }
  };

  function applyNavActive() {
    var keys = activeNav[page] || [];
    document.querySelectorAll('[data-nav]').forEach(function (link) {
      var key = link.getAttribute('data-nav');
      var isMobile = link.hasAttribute('data-nav-mobile');
      var active = keys.indexOf(key) !== -1;

      if (isMobile) {
        link.className = active
          ? 'nav-link-active rounded-xl px-3 py-3 text-sm font-semibold hover:bg-brand/5'
          : 'rounded-xl px-3 py-3 text-sm font-semibold text-[#4a5565] hover:bg-brand/5 hover:text-brand';
      } else {
        link.className = active
          ? 'nav-link-active text-sm font-semibold hover:text-brand'
          : 'text-sm font-semibold text-[#4a5565] hover:text-brand';
      }
    });

    if (page === 'cart') {
      document.querySelectorAll('[data-nav="cart"][data-nav-mobile]').forEach(function (link) {
        link.className = 'nav-link-active rounded-xl px-3 py-3 text-sm font-semibold hover:bg-brand/5';
      });
    }

    if (page === 'signup') {
      var signup = document.getElementById('top-signup');
      if (signup) signup.className = 'font-bold flex items-center gap-1 text-white';
    }

    var extra = productMobileLinks[page];
    if (extra) {
      var menu = document.querySelector('#mobile-menu .flex.flex-col');
      if (menu) {
        var cartLink = menu.querySelector('[data-nav="cart"]');
        var item = document.createElement('a');
        item.href = extra.href;
        item.className = 'nav-link-active rounded-xl px-3 py-3 text-sm font-semibold hover:bg-brand/5';
        item.textContent = extra.label;
        if (cartLink) {
          menu.insertBefore(item, cartLink);
        } else {
          menu.appendChild(item);
        }
      }
    }
  }

  function initMobileMenu() {
    var toggle = document.getElementById('menu-toggle');
    var menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      setNavHeight();
    });

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        setNavHeight();
      });
    });
  }

  function setNavHeight() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;
    var height = nav.offsetHeight;
    document.documentElement.style.setProperty('--nav-height', height + 'px');
    if (document.body.classList.contains('has-site-nav')) {
      document.body.style.paddingTop = height + 'px';
    }
  }

  function initScrollNav() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;

    var lastY = window.scrollY;
    var threshold = 10;

    setNavHeight();

    if (typeof ResizeObserver !== 'undefined') {
      new ResizeObserver(setNavHeight).observe(nav);
    }

    var logo = nav.querySelector('.site-logo');
    if (logo && !logo.complete) {
      logo.addEventListener('load', setNavHeight);
    }

    window.addEventListener('load', setNavHeight);

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      var menu = document.getElementById('mobile-menu');
      var menuOpen = menu && menu.classList.contains('open');

      if (y <= 0 || menuOpen) {
        nav.classList.remove('site-nav--hidden');
      } else if (y > lastY + threshold && y > nav.offsetHeight) {
        nav.classList.add('site-nav--hidden');
      } else if (y < lastY - threshold) {
        nav.classList.remove('site-nav--hidden');
      }

      lastY = y;
    }, { passive: true });

    window.addEventListener('resize', setNavHeight);
  }

  function initTrustBarMarquee() {
    var track = document.querySelector('.trust-bar-track');
    var group = document.querySelector('.trust-bar-group:not([aria-hidden="true"])');
    if (!track || !group) return;

    var existingClone = track.querySelector('.trust-bar-group[aria-hidden="true"]');
    var isMobile = window.matchMedia('(max-width: 639px)').matches;

    if (!isMobile) {
      if (existingClone) existingClone.remove();
      track.dataset.marqueeReady = '';
      return;
    }

    if (existingClone || track.dataset.marqueeReady) return;

    var clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
    track.dataset.marqueeReady = 'true';
  }

  function initHomeBannerSlider() {
    var slider = document.getElementById('home-banner');
    if (!slider) return;

    var viewport = slider.querySelector('.banner-slider-viewport');
    var track = slider.querySelector('.banner-slider-track');
    var dots = slider.querySelectorAll('.banner-slider-dot');
    var prevBtn = slider.querySelector('.banner-slider-arrow--prev');
    var nextBtn = slider.querySelector('.banner-slider-arrow--next');
    if (!viewport || !track || !dots.length) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pauseMs = 4500;
    var slideMs = 700;
    var index = 0;
    var timer = null;
    var paused = false;

    function syncLayout() {
      var width = viewport.offsetWidth;
      var slides = track.querySelectorAll('.banner-slide');

      slides.forEach(function (slide) {
        slide.style.flex = '0 0 ' + width + 'px';
        slide.style.width = width + 'px';
      });

      var activeSlide = slides[index];
      if (activeSlide) {
        viewport.style.height = activeSlide.offsetHeight + 'px';
      }

      track.style.transition = 'none';
      track.style.transform = 'translateX(-' + (index * width) + 'px)';
      setNavHeight();
    }

    function goTo(nextIndex, animate) {
      index = nextIndex;
      var width = viewport.offsetWidth;
      var slides = track.querySelectorAll('.banner-slide');
      var activeSlide = slides[index];

      track.style.transition = animate && !reducedMotion
        ? 'transform ' + slideMs + 'ms ease-in-out'
        : 'none';
      track.style.transform = 'translateX(-' + (index * width) + 'px)';

      if (activeSlide) {
        viewport.style.height = activeSlide.offsetHeight + 'px';
      }

      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }

    function scheduleNext(delay) {
      clearTimeout(timer);
      timer = setTimeout(advance, delay == null ? pauseMs : delay);
    }

    function advance() {
      if (paused || reducedMotion) return;

      var next = (index + 1) % dots.length;
      goTo(next, true);
      setTimeout(function () {
        scheduleNext();
      }, slideMs);
    }

    function start() {
      scheduleNext(pauseMs);
    }

    function step(direction) {
      clearTimeout(timer);
      var next = (index + direction + dots.length) % dots.length;
      goTo(next, !reducedMotion);
      start();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        if (i === index) return;
        clearTimeout(timer);
        goTo(i, !reducedMotion);
        start();
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        step(-1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        step(1);
      });
    }

    slider.addEventListener('mouseenter', function () {
      paused = true;
      clearTimeout(timer);
    });
    slider.addEventListener('mouseleave', function () {
      paused = false;
      start();
    });

    track.querySelectorAll('img').forEach(function (img) {
      if (img.complete) return;
      img.addEventListener('load', syncLayout);
    });

    syncLayout();
    window.addEventListener('resize', syncLayout);

    if (!reducedMotion) {
      start();
    }
  }

  function initReelsCarousel() {
    var viewport = document.getElementById('reels-carousel');
    if (!viewport) return;

    var track = viewport.querySelector('.reels-track');
    var set = viewport.querySelector('.reels-set');
    if (!track || !set) return;

    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pauseMs = 3500;
    var scrollMs = 600;
    var stepIndex = 0;
    var timer = null;
    var paused = false;

    var clone = set.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach(function (link) {
      link.setAttribute('tabindex', '-1');
    });
    track.appendChild(clone);

    function getCards() {
      return set.querySelectorAll('.reel-card');
    }

    function getStepWidth() {
      var cards = getCards();
      if (cards.length < 2) return cards[0] ? cards[0].offsetWidth : 0;
      return cards[1].offsetLeft - cards[0].offsetLeft;
    }

    function getSetWidth() {
      return viewport.offsetWidth;
    }

    function applyTransform(animate) {
      var cards = getCards();
      var offset = stepIndex >= cards.length
        ? getSetWidth()
        : stepIndex * getStepWidth();

      track.style.transition = animate && !reducedMotion
        ? 'transform ' + scrollMs + 'ms ease-in-out'
        : 'none';
      track.style.transform = 'translateX(-' + offset + 'px)';
    }

    function syncWidth() {
      var width = getSetWidth();
      track.querySelectorAll('.reels-set').forEach(function (group) {
        group.style.width = width + 'px';
      });
      applyTransform(false);
    }

    function scheduleNext(delay) {
      clearTimeout(timer);
      timer = setTimeout(advance, delay == null ? pauseMs : delay);
    }

    function advance() {
      if (paused || reducedMotion) return;

      var count = getCards().length;
      stepIndex += 1;
      applyTransform(true);

      setTimeout(function () {
        if (stepIndex >= count) {
          stepIndex = 0;
          applyTransform(false);
        }
        scheduleNext();
      }, scrollMs);
    }

    function start() {
      scheduleNext(pauseMs);
    }

    syncWidth();
    window.addEventListener('resize', syncWidth);

    viewport.addEventListener('mouseenter', function () {
      paused = true;
      clearTimeout(timer);
    });
    viewport.addEventListener('mouseleave', function () {
      paused = false;
      start();
    });

    if (!reducedMotion) {
      start();
    }
  }

  function loadPartial(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('Failed to load ' + url);
      return res.text();
    });
  }

  var headerEl = document.getElementById('site-header');
  var footerEl = document.getElementById('contact');

  Promise.all([
    headerEl ? loadPartial('partials/header.html') : Promise.resolve(''),
    footerEl ? loadPartial('partials/footer.html') : Promise.resolve('')
  ]).then(function (results) {
    if (headerEl && results[0]) {
      headerEl.outerHTML = results[0].replace(/\{\{CONTACT_HREF\}\}/g, contactHref);
      document.body.classList.add('has-site-nav');
      applyNavActive();
      initMobileMenu();
      initScrollNav();
    }
    if (footerEl && results[1]) {
      footerEl.innerHTML = results[1];
      footerEl.className = 'site-footer text-white';
    }

    initTrustBarMarquee();
    initHomeBannerSlider();
    initReelsCarousel();
    requestAnimationFrame(setNavHeight);
    window.addEventListener('resize', initTrustBarMarquee);
  }).catch(function (err) {
    console.error('Layout load error:', err);
  });
})();
