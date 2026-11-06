/**

 * Amaska Artisanal Sweets & Savouries

 * 3D Interactive Website Engine

 */

(function () {

  'use strict';



  var isMobile = function () { return window.innerWidth <= 860; };

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



  // Utility functions

  var clamp = function (v, min, max) { return Math.min(max, Math.max(min, v)); };

  var norm = function (v, start, end) { return clamp((v - start) / (end - start), 0, 1); };

  var easeInOutCubic = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };

  var debounce = function (fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  };



  // Set real viewport height for mobile browser URL bar resizing

  function setVh() {

    document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');

  }

  setVh();

  window.addEventListener('resize', setVh, { passive: true });



  // Mobile navigation drawer

  var menuToggle = document.getElementById('menu-toggle');

  var nav = document.getElementById('nav');

  if (menuToggle && nav) {

    menuToggle.addEventListener('click', function () {

      var isOpen = nav.classList.toggle('open');

      menuToggle.setAttribute('aria-expanded', isOpen);

    });

    nav.addEventListener('click', function (e) {

      if (e.target.tagName === 'A') {

        nav.classList.remove('open');

        menuToggle.setAttribute('aria-expanded', 'false');

      }

    });

  }



  // Top header style switch

  var topBar = document.getElementById('top-bar');



  // ==========================================================================

  // HERO: Pinned Scroll-Scrubbed Box Opening Animation
  // Responsive: video/hero-16x9.mp4 (Desktop) / video/hero-9x16.mp4 (Mobile)
  // ==========================================================================
  var heroSec = document.querySelector('[data-scene="hero"]');
  var heroFrame = heroSec ? heroSec.querySelector('#hero-frame') : null;
  var heroLines = heroSec ? heroSec.querySelectorAll('.line') : [];
  var heroCue = heroSec ? heroSec.querySelector('.cue') : null;
  var heroStill = heroFrame ? heroFrame.querySelector('.still') : null;
  var heroVideo = heroFrame ? heroFrame.querySelector('video') : null;

  function getHeroVideoPath() {
    return window.innerWidth <= 860 ? 'video/hero-9x16.mp4?v=9' : 'video/hero-16x9.mp4';
  }

  var currentHeroTarget = getHeroVideoPath();

  if (!heroVideo && heroFrame) {
    heroVideo = document.createElement('video');
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.preload = 'auto';
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');
    heroVideo.src = currentHeroTarget;
    heroFrame.insertBefore(heroVideo, heroFrame.firstChild);
  } else if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');
    heroVideo.src = currentHeroTarget;
    heroVideo.load();
  }

  var heroClip = {
    v: heroVideo,
    ready: false,
    t: null,
    duration: 9.958
  };

  function setHeroReady() {
    heroClip.ready = true;
    if (heroVideo && heroVideo.duration && !isNaN(heroVideo.duration) && heroVideo.duration > 1) {
      heroClip.duration = heroVideo.duration;
    }
    if (heroSec) heroSec.classList.add('has-clip');
    if (heroFrame) heroFrame.classList.add('has-clip');
  }

  function loadHeroVideo(path) {
    if (!heroVideo) return;
    currentHeroTarget = path;
    if (heroVideo.getAttribute('src') !== path && heroVideo.src.indexOf(path) === -1) {
      heroClip.ready = false;
      heroVideo.src = path;
      heroVideo.load();
    }
    heroVideo.pause();
    try {
      heroVideo.currentTime = 0;
    } catch (_) {}
    setHeroReady();
  }

  if (heroVideo) {
    heroVideo.addEventListener('loadedmetadata', setHeroReady);
    heroVideo.addEventListener('loadeddata', setHeroReady);
    heroVideo.addEventListener('canplay', setHeroReady);
    heroVideo.addEventListener('canplaythrough', setHeroReady);
    heroVideo.addEventListener('timeupdate', setHeroReady);
    if (heroVideo.readyState >= 1) {
      setHeroReady();
    }
    loadHeroVideo(currentHeroTarget);

    var lastIsMobileHero = window.innerWidth <= 860;
    var heroResizeTimer = null;
    window.addEventListener('resize', function () {
      clearTimeout(heroResizeTimer);
      heroResizeTimer = setTimeout(function () {
        var nowIsMob = window.innerWidth <= 860;
        if (nowIsMob !== lastIsMobileHero) {
          lastIsMobileHero = nowIsMob;
          loadHeroVideo(getHeroVideoPath());
        }
      }, 200);
    }, { passive: true });
  }

  function scrubHero(c, p) {
    if (!c || !c.v) return;
    var dur = (c.v.duration && !isNaN(c.v.duration) && c.v.duration > 1) ? c.v.duration : c.duration;
    var target = clamp(p, 0, 1) * (dur - 0.05);
    var lerpFactor = (window.innerWidth <= 860) ? 0.50 : 0.25;
    c.t = (c.t == null) ? target : c.t + (target - c.t) * lerpFactor;
    if (Math.abs(c.v.currentTime - c.t) > 0.02) {
      try {
        if (c.v.readyState >= 1) {
          c.v.currentTime = c.t;
        }
      } catch (_) {}
    }
  }

  // ==========================================================================

  // LIVING 3D MENU BOOK ENGINE (Section 3: Our Sweets Menu)

  // Two-page luxury recipe book with live videos & smooth page turning

  // ==========================================================================

  // ==========================================================================
  // Section 3: 3D Auto-Sliding Coverflow of Rotating Sweet Plates (#sweets)
  // All 10 sweets on white background with multiply blend, contact shadow,
  // 3D perspective rotation, scale, responsive visibility, and auto-slideshow.
  // ==========================================================================
  var SWEETS_DATA = [
    {
      id: 'gulab-jamun',
      name: 'Gulab Jamun',
      price: '₹180 / 4 pcs',
      video: 'assets/plates/01-gulab-jamun.mp4',
      poster: 'assets/plates/01-gulab-jamun.webp',
      scale: 1.08,
      offsetX: 0,
      offsetY: 0
    },
    {
      id: 'kesar-spirals',
      name: 'Kesar Spirals',
      price: '₹380 / 500g',
      video: 'assets/plates/02-kesar-spirals.mp4',
      poster: 'assets/plates/02-kesar-spirals.webp',
      scale: 1.04,
      offsetX: 0,
      offsetY: 0
    },
    {
      id: 'mysore-pak',
      name: 'Mysore Pak',
      price: '₹820 / kg',
      video: 'assets/plates/03-mysore-pak.mp4',
      poster: 'assets/plates/03-mysore-pak.webp',
      scale: 1.00,
      offsetX: 0,
      offsetY: 0
    },
    {
      id: 'kaju-katli',
      name: 'Kaju Katli',
      price: '₹1,200 / kg',
      video: 'assets/plates/04-kaju-katli.mp4',
      poster: 'assets/plates/04-kaju-katli.webp',
      scale: 1.02,
      offsetX: 0,
      offsetY: 0
    },
    {
      id: 'pista-roll',
      name: 'Pista Roll',
      price: '₹1,640 / kg',
      video: 'assets/plates/05-pista-roll.mp4',
      poster: 'assets/plates/05-pista-roll.webp',
      scale: 1.04,
      offsetX: 0,
      offsetY: 0
    },
    {
      id: 'kaju-apple',
      name: 'Kaju Apple',
      price: '₹1,640 / kg',
      video: 'assets/plates/06-kaju-apple.mp4',
      poster: 'assets/plates/06-kaju-apple.webp',
      scale: 1.04,
      offsetX: 0,
      offsetY: -3
    },
    {
      id: 'kaju-flower',
      name: 'Kaju Flower',
      price: '₹1,640 / kg',
      video: 'assets/plates/07-kaju-flower.mp4',
      poster: 'assets/plates/07-kaju-flower.webp',
      scale: 1.02,
      offsetX: 0,
      offsetY: 0
    },
    {
      id: 'motichur-laddu',
      name: 'Motichur Laddu',
      price: '₹380 / 500g',
      video: 'assets/plates/08-motichur-laddu.mp4',
      poster: 'assets/plates/08-motichur-laddu.webp',
      scale: 1.04,
      offsetX: 0,
      offsetY: 0
    },
    {
      id: 'gujiya',
      name: 'Gujiya',
      price: '₹420 / 500g',
      video: 'assets/plates/09-gujiya.mp4',
      poster: 'assets/plates/09-gujiya.webp',
      scale: 1.05,
      offsetX: 0,
      offsetY: 0
    },
    {
      id: 'balushai',
      name: 'Balushai',
      price: '₹410 / 500g',
      video: 'assets/plates/10-balushai.mp4',
      poster: 'assets/plates/10-balushai.webp',
      scale: 1.00,
      offsetX: 0,
      offsetY: 0
    }
  ];

  function initSweetsCoverflow() {
    var secEl = document.getElementById('sweets');
    if (!secEl) return;

    var trackEl = document.getElementById('coverflow-track');
    var titleEl = document.getElementById('coverflow-title');
    var priceEl = document.getElementById('coverflow-price');
    var infoEl = document.getElementById('coverflow-info');
    var dotsContainer = document.getElementById('coverflow-dots');
    var prevBtn = document.getElementById('coverflow-prev');
    var nextBtn = document.getElementById('coverflow-next');

    if (!trackEl) return;

    var totalItems = SWEETS_DATA.length;
    var currentIndex = 0;
    var isTransitioning = false;
    var autoSlideTimer = null;
    var resumeTimer = null;
    var mouseIdleTimer = null;
    var isSectionInView = false;
    var cards = [];
    var dots = [];

    function isElementInViewport(el) {
      if (!el) return false;
      var rect = el.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight || 800;
      return (rect.top < vh && rect.bottom > 0);
    }

    // 1. Build DOM Cards & Dots dynamically
    trackEl.innerHTML = '';
    if (dotsContainer) dotsContainer.innerHTML = '';

    SWEETS_DATA.forEach(function (sweet, i) {
      // Create card
      var card = document.createElement('div');
      card.className = 'coverflow-card';
      card.dataset.index = String(i);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', sweet.name);

      var wrap = document.createElement('div');
      wrap.className = 'coverflow-plate-wrap';
      wrap.style.setProperty('--plate-scale', sweet.scale || 1);
      wrap.style.setProperty('--plate-x', (sweet.offsetX || 0) + 'px');
      wrap.style.setProperty('--plate-y', (sweet.offsetY || 0) + 'px');

      var shadow = document.createElement('div');
      shadow.className = 'coverflow-shadow';
      wrap.appendChild(shadow);

      var video = document.createElement('video');
      video.className = 'coverflow-video';
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('muted', '');
      video.preload = (i === 0) ? 'auto' : 'none';
      video.src = sweet.video;

      var poster = document.createElement('img');
      poster.className = 'coverflow-poster';
      poster.src = sweet.poster;
      poster.alt = sweet.name;
      poster.loading = (i <= 2 || i >= totalItems - 2) ? 'eager' : 'lazy';

      function markVideoPlaying() {
        if (card.classList.contains('is-center')) {
          video.classList.add('is-playing');
        }
      }
      video.addEventListener('playing', markVideoPlaying);
      video.addEventListener('timeupdate', function () {
        if (video.currentTime > 0) markVideoPlaying();
      });

      wrap.appendChild(video);
      wrap.appendChild(poster);
      card.appendChild(wrap);
      trackEl.appendChild(card);
      cards.push(card);

      // Create Dot
      if (dotsContainer) {
        var dot = document.createElement('button');
        dot.className = 'coverflow-dot' + (i === 0 ? ' is-active' : '');
        dot.type = 'button';
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        dot.setAttribute('aria-label', sweet.name);
        dot.textContent = String(i + 1).padStart(2, '0');
        dot.dataset.target = String(i);

        dot.addEventListener('click', function (e) {
          e.preventDefault();
          pauseAndResume();
          goToIndex(i);
        });

        dotsContainer.appendChild(dot);
        dots.push(dot);
      }

      // Card click: brings it to center
      card.addEventListener('click', function () {
        pauseAndResume();
        goToIndex(i);
      });

      // Card keyboard Enter / Space
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pauseAndResume();
          goToIndex(i);
        }
      });
    });

    // 2. Position all cards in 3D
    function updateCoverflowPositions() {
      var isMobileView = window.innerWidth <= 680;
      var isTabletView = window.innerWidth <= 1024 && !isMobileView;

      cards.forEach(function (card, i) {
        var diff = (i - currentIndex) % totalItems;
        if (diff > totalItems / 2) diff -= totalItems;
        if (diff < -totalItems / 2) diff += totalItems;

        var video = card.querySelector('video');

        if (diff === 0) {
          // Center card (Active)
          card.className = 'coverflow-card is-center';
          card.style.transform = 'translate3d(0, 0, 0) scale(1) rotateY(0deg)';
          card.style.opacity = '1';
          card.style.zIndex = '12';
          card.style.pointerEvents = 'auto';
          card.style.visibility = 'visible';

          // Play active video if not prefersReducedMotion
          if (!prefersReducedMotion && isSectionInView && video) {
            video.preload = 'auto';
            var p = video.play();
            if (p !== undefined) p.catch(function () {});
          }
        } else {
          card.className = 'coverflow-card';
          if (video) {
            video.pause();
            if (video.classList) video.classList.remove('is-playing');
          }

          var absDiff = Math.abs(diff);

          if (isMobileView) {
            // Mobile: center large, peek neighbours at ±1, smooth continuous glide for ±2
            if (absDiff === 1) {
              var mX = diff > 0 ? 66 : -66;
              var mRot = diff > 0 ? -18 : 18;
              card.style.transform = 'translate3d(' + mX + '%, 0, -100px) scale(0.68) rotateY(' + mRot + 'deg)';
              card.style.opacity = '0.38';
              card.style.zIndex = '6';
              card.style.pointerEvents = 'auto';
              card.style.visibility = 'visible';
            } else if (absDiff === 2) {
              var mX2 = diff > 0 ? 115 : -115;
              var mRot2 = diff > 0 ? -30 : 30;
              card.style.transform = 'translate3d(' + mX2 + '%, 0, -220px) scale(0.44) rotateY(' + mRot2 + 'deg)';
              card.style.opacity = '0';
              card.style.zIndex = '2';
              card.style.pointerEvents = 'none';
              card.style.visibility = 'visible';
            } else {
              card.style.transform = 'translate3d(' + (diff > 0 ? 140 : -140) + '%, 0, -320px) scale(0.35) rotateY(' + (diff > 0 ? -35 : 35) + 'deg)';
              card.style.opacity = '0';
              card.style.zIndex = '1';
              card.style.pointerEvents = 'none';
              card.style.visibility = 'hidden';
            }
          } else if (isTabletView) {
            // Tablet: 3 plates (Center, ±1)
            if (absDiff === 1) {
              var tX = diff > 0 ? 56 : -56;
              var tRot = diff > 0 ? -26 : 26;
              card.style.transform = 'translate3d(' + tX + '%, 0, -160px) scale(0.74) rotateY(' + tRot + 'deg)';
              card.style.opacity = '0.70';
              card.style.zIndex = '8';
              card.style.pointerEvents = 'auto';
              card.style.visibility = 'visible';
            } else {
              card.style.transform = 'translate3d(' + (diff > 0 ? 115 : -115) + '%, 0, -400px) scale(0.45) rotateY(' + (diff > 0 ? -45 : 45) + 'deg)';
              card.style.opacity = '0';
              card.style.zIndex = '1';
              card.style.pointerEvents = 'none';
              card.style.visibility = 'hidden';
            }
          } else {
            // Desktop: 5 plates (Center, ±1, ±2)
            if (absDiff === 1) {
              var dX1 = diff > 0 ? 54 : -54;
              var dRot1 = diff > 0 ? -28 : 28;
              card.style.transform = 'translate3d(' + dX1 + '%, 0, -160px) scale(0.76) rotateY(' + dRot1 + 'deg)';
              card.style.opacity = '0.72';
              card.style.zIndex = '8';
              card.style.pointerEvents = 'auto';
              card.style.visibility = 'visible';
            } else if (absDiff === 2) {
              var dX2 = diff > 0 ? 98 : -98;
              var dRot2 = diff > 0 ? -42 : 42;
              card.style.transform = 'translate3d(' + dX2 + '%, 0, -320px) scale(0.55) rotateY(' + dRot2 + 'deg)';
              card.style.opacity = '0.40';
              card.style.zIndex = '5';
              card.style.pointerEvents = 'auto';
              card.style.visibility = 'visible';
            } else {
              card.style.transform = 'translate3d(' + (diff > 0 ? 135 : -135) + '%, 0, -500px) scale(0.38) rotateY(' + (diff > 0 ? -50 : 50) + 'deg)';
              card.style.opacity = '0';
              card.style.zIndex = '1';
              card.style.pointerEvents = 'none';
              card.style.visibility = 'hidden';
            }
          }
        }
      });

      // Update dots
      dots.forEach(function (dot, i) {
        var active = (i === currentIndex);
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', active ? 'true' : 'false');
      });

      // Update Details Text with subtle fade/slide
      if (infoEl && titleEl && priceEl) {
        var currentSweet = SWEETS_DATA[currentIndex];
        infoEl.style.opacity = '0';
        infoEl.style.transform = 'translateY(6px)';
        setTimeout(function () {
          titleEl.textContent = currentSweet.name;
          priceEl.textContent = currentSweet.price;
          infoEl.style.opacity = '1';
          infoEl.style.transform = 'translateY(0)';
        }, 180);
      }

      // Preload adjacent
      var nextIdx = (currentIndex + 1) % totalItems;
      var prevIdx = (currentIndex - 1 + totalItems) % totalItems;
      [nextIdx, prevIdx].forEach(function (idx) {
        var c = cards[idx];
        if (c) {
          var v = c.querySelector('video');
          if (v && v.preload === 'none') v.preload = 'metadata';
        }
      });
    }

    // 3. Navigation handler
    function goToIndex(targetIdx) {
      if (isTransitioning || targetIdx === currentIndex) return;
      isTransitioning = true;
      currentIndex = (targetIdx + totalItems) % totalItems;
      updateCoverflowPositions();

      setTimeout(function () {
        isTransitioning = false;
      }, 750);
    }

    function nextSweet() {
      goToIndex(currentIndex + 1);
    }

    function prevSweet() {
      goToIndex(currentIndex - 1);
    }

    // 4. Auto-slide slideshow (every 3.2 seconds)
    var autoSlideDelay = 4000;

    function startAutoSlide() {
      stopAutoSlide();
      if (prefersReducedMotion) return;
      autoSlideTimer = setInterval(function () {
        if (!isTransitioning && (isSectionInView || isElementInViewport(secEl))) {
          nextSweet();
        }
      }, autoSlideDelay);
    }

    function stopAutoSlide() {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    }

    function pauseAndResume(delay) {
      stopAutoSlide();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () {
        if (isSectionInView || isElementInViewport(secEl)) {
          startAutoSlide();
        }
      }, delay || 2600);
    }

    // 5. User controls & listeners
    if (prevBtn) {
      prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        pauseAndResume(3200);
        prevSweet();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        pauseAndResume(3200);
        nextSweet();
      });
    }

    // Keyboard navigation
    window.addEventListener('keydown', function (e) {
      if (isTransitioning) return;
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight') {
        pauseAndResume(3200);
        nextSweet();
      } else if (e.key === 'ArrowLeft') {
        pauseAndResume(3200);
        prevSweet();
      }
    });

    // Touch & mouse swipe support
    var startX = 0;
    var isDragging = false;

    secEl.addEventListener('mouseenter', function () {
      stopAutoSlide();
      clearTimeout(mouseIdleTimer);
      mouseIdleTimer = setTimeout(function () {
        if (isSectionInView || isElementInViewport(secEl)) startAutoSlide();
      }, 3000);
    });

    secEl.addEventListener('mouseleave', function () {
      clearTimeout(mouseIdleTimer);
      if (isSectionInView || isElementInViewport(secEl)) startAutoSlide();
    });

    secEl.addEventListener('mousemove', function () {
      stopAutoSlide();
      clearTimeout(mouseIdleTimer);
      mouseIdleTimer = setTimeout(function () {
        if (isSectionInView || isElementInViewport(secEl)) startAutoSlide();
      }, 2600);
    }, { passive: true });

    secEl.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches[0]) {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoSlide();
      }
    }, { passive: true });

    secEl.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      pauseAndResume(2800);
      if (e.changedTouches && e.changedTouches[0]) {
        var diffX = e.changedTouches[0].clientX - startX;
        if (Math.abs(diffX) > 40) {
          if (diffX < 0) nextSweet();
          else prevSweet();
        }
      }
    }, { passive: true });

    // Window resize
    window.addEventListener('resize', function () {
      updateCoverflowPositions();
    }, { passive: true });

    // Ambient Live Jali Light-and-Shadow Symmetrical Background Control
    var leftLightVideo = document.getElementById('sweets-light-video-left');
    var rightLightVideo = document.getElementById('sweets-light-video-right');
    if (leftLightVideo) leftLightVideo.playbackRate = 0.7; // Serene, gentle pace
    if (rightLightVideo) rightLightVideo.playbackRate = 0.7;

    // Keep left & right video streams in sync
    if (leftLightVideo && rightLightVideo) {
      // Native loop sync without decoder flushing
      leftLightVideo.addEventListener('ended', function () {
        if (rightLightVideo) rightLightVideo.currentTime = 0;
      });
      leftLightVideo.addEventListener('play', function () {
        if (!prefersReducedMotion) {
          var p = rightLightVideo.play();
          if (p !== undefined) p.catch(function () {});
        }
      });
      leftLightVideo.addEventListener('pause', function () {
        rightLightVideo.pause();
      });
    }

    function playLightVideos() {
      if (prefersReducedMotion) return;
      if (leftLightVideo) {
        var p1 = leftLightVideo.play();
        if (p1 !== undefined) p1.catch(function () {});
      }
      if (rightLightVideo) {
        var p2 = rightLightVideo.play();
        if (p2 !== undefined) p2.catch(function () {});
      }
    }

    function pauseLightVideos() {
      if (leftLightVideo) leftLightVideo.pause();
      if (rightLightVideo) rightLightVideo.pause();
    }

    // Opposite desktop parallax on live light background wings (up to 4px)
    var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice && window.innerWidth > 680) {
      secEl.addEventListener('mousemove', function (e) {
        var rect = secEl.getBoundingClientRect();
        var relX = (e.clientX - rect.left) / rect.width - 0.5;
        var relY = (e.clientY - rect.top) / rect.height - 0.5;
        var pX = Number((relX * 8).toFixed(1)); // -4px to +4px
        var pY = Number((relY * 6).toFixed(1)); // -3px to +3px
        secEl.style.setProperty('--light-px-left', pX + 'px');
        secEl.style.setProperty('--light-px-right', (-pX) + 'px');
        secEl.style.setProperty('--light-py', pY + 'px');
      }, { passive: true });
    }

    // IntersectionObserver: play and auto-slide only when in viewport
    var coverflowObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isSectionInView = entry.isIntersecting;
        if (isSectionInView) {
          updateCoverflowPositions();
          startAutoSlide();
          playLightVideos();
        } else {
          stopAutoSlide();
          // Pause center video
          var activeCard = cards[currentIndex];
          if (activeCard) {
            var v = activeCard.querySelector('video');
            if (v) v.pause();
          }
          pauseLightVideos();
        }
      });
    }, { threshold: 0.1 });
    coverflowObserver.observe(secEl);

    // Initial setup (Observer will trigger when scrolled into view)
    updateCoverflowPositions();
    if (isElementInViewport(secEl)) {
      isSectionInView = true;
      startAutoSlide();
      playLightVideos();
    }
  }

  // ==========================================================================

  function initGiftBoxes() {

    var boxesData = {

      'box-gk': {

        id: 'box-gk',

        name: 'Ghee & Khova Assorted Sweets',

        clip: 'box-gk-16x9',

        still: 'assets/box-gk-closed.webp',

        sizes: [

          { label: '1 kg', price: '₹820', full: '1 kg (₹820)' },

          { label: '500 g', price: '₹410', full: '500 g (₹410)' },

          { label: '250 g', price: '₹205', full: '250 g (₹205)' }

        ],

        contents: 'Motichur Laddu, Banaras Sohanpapdi, Balushai, Bombay Halwa, Besan Laddu, Mysore Pak, Karadant, Doodh Peda, Coconut Burfi, Malt Burfi, Chocolate Stick.'

      },

      'box-df': {

        id: 'box-df',

        name: 'Ghee, Khova & Dry Fruit Assorted',

        clip: 'box-df-16x9',

        still: 'assets/box-df-closed.webp',

        sizes: [

          { label: '1 kg', price: '₹920', full: '1 kg (₹920)' },

          { label: '500 g', price: '₹460', full: '500 g (₹460)' }

        ],

        contents: 'Kaju Katli, Kaju Pine, Anjeer Dry Fruit Roll, Dry Fruit Laddu, Gulkand Burfi, Dry Fruit Halwa, Motichur Laddu, Banaras Sohanpapdi, Mysore Pak, Malt Burfi.'

      },

      'box-royal': {

        id: 'box-royal',

        name: 'Royal Kaju Assorted Sweets',

        clip: 'box-royal-16x9',

        still: 'assets/box-royal-closed.webp',

        sizes: [

          { label: '500 g', price: '₹690', full: '500 g (₹690)' },

          { label: '250 g', price: '₹345', full: '250 g (₹345)' }

        ],

        contents: 'Pure Cashew delicacies: Kaju Katli, Kaju Apple, Kaju Flower, Pista Roll, and Silver Embossed Cashew confections.'

      }

    };



    var boxKeys = ['box-gk', 'box-df', 'box-royal'];

    var currentBoxKey = 'box-gk';

    var selectedSize = null;

    var activeOriginCard = null;

    var isOpening = false;

    var isClosing = false;



    var boxesGrid = document.getElementById('boxes-grid');

    var cards = document.querySelectorAll('.box-card[data-box-id]');

    var modal = document.getElementById('box-modal');

    if (!boxesGrid || !modal) return;



    var modalBackdrop = document.getElementById('box-modal-backdrop');

    var modalClose = document.getElementById('box-modal-close');

    var modalPrev = document.getElementById('box-modal-prev');

    var modalNext = document.getElementById('box-modal-next');

    var modalStage = document.getElementById('box-modal-stage');

    var modalStill = document.getElementById('box-modal-still');

    var modalVideo = document.getElementById('box-modal-video');

    var modalTitle = document.getElementById('box-modal-title');

    var modalSizes = document.getElementById('box-modal-sizes');

    var modalDesc = document.getElementById('box-modal-desc');

    var modalOrder = document.getElementById('box-modal-order');



    // 1. Desktop Hover: Card lifts translateY(-8px) and tilts slightly in 3D (max 6deg) toward mouse

    cards.forEach(function (card) {

      card.addEventListener('mousemove', function (e) {

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 960) return;

        var r = card.getBoundingClientRect();

        var x = (e.clientX - r.left) / r.width - 0.5;

        var y = (e.clientY - r.top) / r.height - 0.5;

        var rotX = -y * 8;

        var rotY = x * 8;

        card.style.transform = 'translateY(-8px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';

      });



      card.addEventListener('mouseleave', function () {

        card.style.transform = '';

      });



      // Tap / Click to open big

      card.addEventListener('click', function () {

        var boxId = card.getAttribute('data-box-id');

        openBoxModal(boxId, card);

      });



      card.addEventListener('keydown', function (e) {

        if (e.key === 'Enter' || e.key === ' ') {

          e.preventDefault();

          var boxId = card.getAttribute('data-box-id');

          openBoxModal(boxId, card);

        }

      });

    });



    function updateDetails(box) {

      currentBoxKey = box.id;

      modalTitle.textContent = box.name;

      modalDesc.textContent = box.contents;

      modalSizes.innerHTML = '';



      selectedSize = box.sizes[0];



      box.sizes.forEach(function (sz, idx) {

        var btn = document.createElement('button');

        btn.type = 'button';

        btn.className = 'box-modal-size-btn' + (idx === 0 ? ' active' : '');

        btn.innerHTML = '<small>' + sz.label + '</small><b>' + sz.price + '</b>';

        btn.addEventListener('click', function () {

          modalSizes.querySelectorAll('.box-modal-size-btn').forEach(function (b) { b.classList.remove('active'); });

          btn.classList.add('active');

          selectedSize = sz;

          updateOrderLink(box, sz);

        });

        modalSizes.appendChild(btn);

      });



      updateOrderLink(box, selectedSize);

    }



    function updateOrderLink(box, sz) {

      var msg = 'Hello Amaska, I would like to order the ' + box.name + ' (' + sz.full + ').';

      modalOrder.href = 'https://wa.me/919663897371?text=' + encodeURIComponent(msg);

    }



    function openBoxModal(boxId, cardEl) {

      if (isOpening || isClosing) return;

      var box = boxesData[boxId];

      if (!box) return;



      isOpening = true;

      activeOriginCard = cardEl || document.querySelector('.box-card[data-box-id="' + boxId + '"]');



      // Lock scrolling

      document.body.style.overflow = 'hidden';



      // Other cards fade back and blur

      boxesGrid.classList.add('has-open-box');

      cards.forEach(function (c) {

        if (c === activeOriginCard) c.classList.add('is-active');

        else c.classList.remove('is-active');

      });



      // Populate details

      updateDetails(box);



      // Set still image first

      modalStill.src = box.still;

      modalStill.alt = box.name;

      modalStage.classList.remove('has-video');



      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;



      // Get origin card media rect for FLIP

      var originMedia = activeOriginCard ? activeOriginCard.querySelector('.box-media') : null;

      var rectCard = originMedia ? originMedia.getBoundingClientRect() : null;



      // Open modal

      modal.classList.add('open');

      modal.setAttribute('aria-hidden', 'false');



      if (!prefersReducedMotion && rectCard) {

        var rectTarget = modalStage.getBoundingClientRect();

        var dx = rectCard.left - rectTarget.left;

        var dy = rectCard.top - rectTarget.top;

        var sx = rectCard.width / rectTarget.width;

        var sy = rectCard.height / rectTarget.height;



        modalStage.style.transition = 'none';

        modalStage.style.transformOrigin = '0 0';

        modalStage.style.transform = 'translate3d(' + dx.toFixed(1) + 'px, ' + dy.toFixed(1) + 'px, 0) scale(' + sx.toFixed(3) + ', ' + sy.toFixed(3) + ') rotateY(8deg)';



        modalStage.offsetHeight; // Force reflow



        modalStage.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';

        modalStage.style.transform = 'translate3d(0, 0, 0) scale(1, 1) rotateY(0deg)';

      }



      // Play video once arrival finishes

      setTimeout(function () {

        isOpening = false;

        playBoxVideo(box.clip);

      }, prefersReducedMotion ? 100 : 750);

    }



    function playBoxVideo(clipName) {

      modalVideo.pause();

      modalVideo.src = 'video/' + clipName + '.mp4';

      modalVideo.currentTime = 0;

      modalVideo.load();



      modalVideo.oncanplay = function () {

        modalStage.classList.add('has-video');

        var playPromise = modalVideo.play();

        if (playPromise !== undefined) {

          playPromise.catch(function () {});

        }

      };



      modalVideo.onended = function () {

        // Keeps the box open, paused on the last frame

      };

    }



    function closeBoxModal() {

      if (isClosing) return;

      isClosing = true;



      modalVideo.pause();



      var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      var originMedia = activeOriginCard ? activeOriginCard.querySelector('.box-media') : null;

      var rectCard = originMedia ? originMedia.getBoundingClientRect() : null;



      if (!prefersReducedMotion && rectCard) {

        var rectTarget = modalStage.getBoundingClientRect();

        var dx = rectCard.left - rectTarget.left;

        var dy = rectCard.top - rectTarget.top;

        var sx = rectCard.width / rectTarget.width;

        var sy = rectCard.height / rectTarget.height;



        modalStage.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';

        modalStage.style.transform = 'translate3d(' + dx.toFixed(1) + 'px, ' + dy.toFixed(1) + 'px, 0) scale(' + sx.toFixed(3) + ', ' + sy.toFixed(3) + ')';

      }



      modal.classList.remove('open');

      modal.setAttribute('aria-hidden', 'true');



      setTimeout(function () {

        modalStage.style.transform = '';

        modalStage.style.transition = '';

        modalStage.classList.remove('has-video');

        modalVideo.src = '';

        document.body.style.overflow = '';

        boxesGrid.classList.remove('has-open-box');

        cards.forEach(function (c) { c.classList.remove('is-active'); });

        isClosing = false;

      }, prefersReducedMotion ? 100 : 580);

    }



    function navigateBox(direction) {

      var currentIndex = boxKeys.indexOf(currentBoxKey);

      if (currentIndex === -1) currentIndex = 0;

      var nextIndex = (currentIndex + direction + boxKeys.length) % boxKeys.length;

      var nextKey = boxKeys[nextIndex];

      var nextBox = boxesData[nextKey];



      // Update active origin card

      activeOriginCard = document.querySelector('.box-card[data-box-id="' + nextKey + '"]');

      cards.forEach(function (c) {

        if (c === activeOriginCard) c.classList.add('is-active');

        else c.classList.remove('is-active');

      });



      modalStage.classList.remove('has-video');

      modalStill.src = nextBox.still;

      modalStill.alt = nextBox.name;



      updateDetails(nextBox);

      playBoxVideo(nextBox.clip);

    }



    modalClose.addEventListener('click', closeBoxModal);

    modalBackdrop.addEventListener('click', closeBoxModal);

    modalPrev.addEventListener('click', function () { navigateBox(-1); });

    modalNext.addEventListener('click', function () { navigateBox(1); });



    document.addEventListener('keydown', function (e) {

      if (!modal.classList.contains('open')) return;

      if (e.key === 'Escape') closeBoxModal();

      if (e.key === 'ArrowLeft') navigateBox(-1);

      if (e.key === 'ArrowRight') navigateBox(1);

    });



    window.addEventListener('popstate', function () {

      if (modal.classList.contains('open')) {

        closeBoxModal();

      }

    });

  }



  // ==========================================================================

  // Data Loop Videos (Gift boxes, Mysore Pak, Namkeen)

  // Autoplay when in viewport with intersection observer

  // ==========================================================================

  var loopElements = document.querySelectorAll('[data-loop]');

  loopElements.forEach(function (container) {

    var clipName = container.dataset.loop;

    if (!clipName) return;



    var video = document.createElement('video');

    video.muted = true;

    video.playsInline = true;

    video.loop = true;

    video.preload = 'metadata';

    video.setAttribute('muted', '');

    video.setAttribute('playsinline', '');

    video.src = 'video/' + clipName + '-16x9.mp4';



    video.addEventListener('loadeddata', function () {

      container.classList.add('has-clip');

    });



    container.appendChild(video);



    var observer = new IntersectionObserver(function (entries) {

      entries.forEach(function (entry) {

        if (entry.isIntersecting) {

          video.play().catch(function () {});

        } else {

          video.pause();

        }

      });

    }, { threshold: 0.15 });



    observer.observe(container);

  });



  // Reveal animations on scroll

  var revealObserver = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

      if (entry.isIntersecting) {

        entry.target.classList.add('in');

      }

    });

  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });



  document.querySelectorAll('.rv').forEach(function (el) {

    revealObserver.observe(el);

  });



  // ==========================================================================

  // Main Animation Loop for Smooth Scrubbing & Scroll Tracking

  // ==========================================================================

  var progressBar = document.getElementById('progress');

  var lastFrameTime = performance.now();



  function onFrame(now) {

    var dt = Math.min(0.05, (now - lastFrameTime) / 1000);

    lastFrameTime = now;



    var scrollY = window.pageYOffset || document.documentElement.scrollTop;

    var winHeight = window.innerHeight;

    var docHeight = document.documentElement.scrollHeight - winHeight;



    // Progress bar at top

    if (progressBar && docHeight > 0) {

      progressBar.style.transform = 'scaleX(' + (scrollY / docHeight).toFixed(4) + ')';

    }



    // Hero scene scroll scrubbing

    if (heroSec && heroFrame) {

      var stage = heroSec.querySelector('.stage') || heroSec;

      var run = heroSec.offsetHeight - stage.offsetHeight;

      var rect = heroSec.getBoundingClientRect();

      var p = run > 0 ? clamp(-rect.top / run, 0, 1) : 0;



      // Scrub the hero video

      if (heroClip && !heroClip.ready && heroVideo && heroVideo.readyState >= 1) {
        setHeroReady();
      }
      if (heroClip && heroClip.ready) {

        scrubHero(heroClip, clamp(p / 0.74, 0, 1));

        // Mobile: tint the empty area above the video so it blends with the video's top edge
        if (window.innerWidth <= 860 && heroVideo && heroVideo.duration) {
          var kf = [[0,[26,9,7]],[0.30,[27,9,7]],[0.37,[53,30,17]],[0.50,[64,42,30]],[0.62,[31,13,9]],[0.75,[30,12,9]],[0.88,[55,18,24]],[1,[74,25,35]]];
          var ff = clamp(heroVideo.currentTime / heroVideo.duration, 0, 1), a = kf[0], b = kf[kf.length - 1];
          for (var ki = 0; ki < kf.length - 1; ki++) { if (ff >= kf[ki][0] && ff <= kf[ki + 1][0]) { a = kf[ki]; b = kf[ki + 1]; break; } }
          var kt = b[0] === a[0] ? 0 : (ff - a[0]) / (b[0] - a[0]);
          heroFrame.style.backgroundColor = 'rgb(' + [0, 1, 2].map(function (i) { return Math.round(a[1][i] + (b[1][i] - a[1][i]) * kt); }).join(',') + ')';
        }

      } else if (heroStill) {

        heroStill.style.transform = 'scale(' + (1.06 + p * 0.1) + ')';

      }



      // Fade hero copy lines

      if (heroLines.length >= 2) {

        var line1Opacity = 1 - norm(p, 0.26, 0.36);

        var line2Opacity = norm(p, 0.42, 0.52) * (1 - norm(p, 0.74, 0.82));



        heroLines[0].style.opacity = line1Opacity;

        heroLines[0].style.transform = 'translateY(' + ((1 - line1Opacity) * -24).toFixed(1) + 'px)';

        heroLines[0].style.visibility = line1Opacity < 0.02 ? 'hidden' : 'visible';



        heroLines[1].style.opacity = line2Opacity;

        heroLines[1].style.transform = 'translateY(' + ((1 - line2Opacity) * 24).toFixed(1) + 'px)';

        heroLines[1].style.visibility = line2Opacity < 0.02 ? 'hidden' : 'visible';

      }



      // Fade scroll cue indicator

      if (heroCue) {

        heroCue.style.opacity = 1 - norm(p, 0, 0.06);

      }



      // Smooth card insetting transition into cream background at end of hero

      var s = easeInOutCubic(norm(p, 0.80, 1.0));

      var mob = isMobile();

      if (s > 0) {

        var vhInset = s * (mob ? 10 : 12);

        var vwInset = s * (mob ? 4 : 6);

        var radius = s * 28;

        heroFrame.style.clipPath = 'inset(' + vhInset.toFixed(1) + 'vh ' + vwInset.toFixed(1) + 'vw ' + vhInset.toFixed(1) + 'vh round ' + radius.toFixed(1) + 'px)';

      } else {

        heroFrame.style.clipPath = 'none';

      }



      // Top bar style switch: on mobile, matches cream 2nd page header; on desktop, switches cleanly
      var isMobileView = window.innerWidth <= 860;
      var heroDark = !isMobileView && (s < 0.98);

      if (topBar) {
        topBar.classList.toggle('solid', isMobileView || !(rect && rect.bottom > 80 && heroDark));
      }

    }



    // Story Cashew Parallax & Playback

    var storySec = document.getElementById('story');

    var storyVideo = document.getElementById('story-cashew-video');

    if (storySec && storyVideo) {

      var sRect = storySec.getBoundingClientRect();

      if (sRect.bottom > 0 && sRect.top < winHeight) {

        var sProgress = clamp((winHeight - sRect.top) / (winHeight + sRect.height), 0, 1);

        var pY = (1 - sProgress) * -18;

        storyVideo.style.transformOrigin = 'center bottom';

        storyVideo.style.transform = 'translateY(' + pY.toFixed(1) + 'px)';

        if (storyVideo.paused) {

          storyVideo.play().catch(function () {});

        }

      } else {

        if (!storyVideo.paused) {

          storyVideo.pause();

        }

      }

    }



    requestAnimationFrame(onFrame);

  }

  requestAnimationFrame(onFrame);

  // ==========================================================================
  // Section 5: Sweets by Weight & Namkeen (#counter / .counter-3d)
  // 3D Tilt Cards, Live Weight Selector & Price Calculation, WhatsApp Ordering
  // ==========================================================================
  var COUNTER_SWEETS = [
    {
      id: 'kaju-anjeer-sandwich',
      name: 'Kaju Anjeer Sandwich',
      pricePerKg: 1640,
      bestBefore: 'Best before 15 days'
    },
    {
      id: 'milk-dry-fruit-burfi',
      name: 'Milk Dry Fruit Burfi',
      pricePerKg: 1640,
      bestBefore: 'Best before 15 days'
    }
  ];

  function initCounterSection() {
    var counterSec = document.getElementById('counter');
    if (!counterSec) return;

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || !window.matchMedia('(hover: hover)').matches;

    // 1. Live Weight Selector and Price Count-up (Row 1 Weight Cards)
    var weightCards = counterSec.querySelectorAll('.counter-weight-card');
    weightCards.forEach(function (card) {
      var sweetId = card.dataset.sweetId;
      var sweetData = COUNTER_SWEETS.find(function (s) { return s.id === sweetId; });
      if (!sweetData) return;

      var chips = card.querySelectorAll('.weight-chip');
      var priceEl = card.querySelector('.weight-price');
      var unitValEl = card.querySelector('.weight-unit-val');
      var orderBtn = card.querySelector('.weight-order-btn');
      var beamGroup = card.querySelector('.scale-beam-group');

      var currentWeight = 500; // default 500g
      var currentPrice = Math.round(sweetData.pricePerKg * (currentWeight / 1000));

      function updateWhatsAppLink(weightG, priceNum) {
        if (!orderBtn) return;
        var weightStr = (weightG >= 1000) ? (weightG / 1000) + ' kg' : weightG + ' g';
        var priceFormatted = '₹' + priceNum.toLocaleString('en-IN');
        var msg = 'Hello Amaska, I would like to order ' + weightStr + ' of ' + sweetData.name + ' (' + priceFormatted + ').';
        orderBtn.href = 'https://wa.me/919663897371?text=' + encodeURIComponent(msg);
      }

      function animatePrice(fromVal, toVal, duration) {
        if (prefersReduced || duration <= 0) {
          if (priceEl) priceEl.textContent = '₹' + toVal.toLocaleString('en-IN');
          return;
        }

        if (priceEl) {
          priceEl.classList.add('is-pulsing');
          setTimeout(function () {
            priceEl.classList.remove('is-pulsing');
          }, 260);
        }

        var startTime = performance.now();
        function step(now) {
          var elapsed = now - startTime;
          var progress = Math.min(elapsed / duration, 1);
          // easeOutCubic
          var ease = 1 - Math.pow(1 - progress, 3);
          var val = Math.round(fromVal + (toVal - fromVal) * ease);
          if (priceEl) priceEl.textContent = '₹' + val.toLocaleString('en-IN');

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            if (priceEl) priceEl.textContent = '₹' + toVal.toLocaleString('en-IN');
          }
        }
        requestAnimationFrame(step);
      }

      function updateBeamTilt(weightG) {
        if (!beamGroup || prefersReduced) return;
        var angle = 0;
        if (weightG === 250) angle = -4; // tips left
        else if (weightG === 500) angle = 0; // balanced
        else if (weightG === 1000) angle = 4; // tips right
        beamGroup.style.transform = 'rotate(' + angle + 'deg)';
      }

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var newWeight = parseInt(chip.dataset.weight, 10);
          if (newWeight === currentWeight) return;

          chips.forEach(function (c) {
            c.classList.remove('is-selected');
            c.setAttribute('aria-pressed', 'false');
          });
          chip.classList.add('is-selected');
          chip.setAttribute('aria-pressed', 'true');

          var newPrice = Math.round(sweetData.pricePerKg * (newWeight / 1000));
          var oldPrice = currentPrice;

          currentWeight = newWeight;
          currentPrice = newPrice;

          var unitText = (newWeight >= 1000) ? (newWeight / 1000) + ' kg' : newWeight + ' g';
          if (unitValEl) unitValEl.textContent = unitText;

          animatePrice(oldPrice, newPrice, 380);
          updateBeamTilt(newWeight);
          updateWhatsAppLink(newWeight, newPrice);
        });
      });

      // Initialize defaults
      updateWhatsAppLink(currentWeight, currentPrice);
      updateBeamTilt(currentWeight);
    });

    // 2. 3D Tilt for Weight Cards (max tilt 5deg)
    var tiltWeightCards = counterSec.querySelectorAll('[data-tilt-weight]');
    if (!isTouch && !prefersReduced) {
      tiltWeightCards.forEach(function (card) {
        var shine = card.querySelector('.card-3d-shine');
        var rafId = null;

        card.addEventListener('mouseenter', function () {
          card.style.willChange = 'transform, box-shadow';
          card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
        });

        card.addEventListener('mousemove', function (e) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(function () {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            // Max tilt ~5deg
            var rotX = ((centerY - y) / centerY) * 5.0;
            var rotY = ((x - centerX) / centerX) * 5.0;

            card.style.transform = 'perspective(1100px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg) translateZ(0)';
            card.style.boxShadow = (-rotY * 1.6).toFixed(1) + 'px ' + (rotX * 1.6 + 18).toFixed(1) + 'px 32px -12px rgba(62, 0, 32, 0.12)';

            if (shine) {
              var shineX = ((x / rect.width) * 100).toFixed(1);
              var shineY = ((y / rect.height) * 100).toFixed(1);
              shine.style.background = 'radial-gradient(circle 280px at ' + shineX + '% ' + shineY + '%, rgba(255, 255, 255, 0.26) 0%, rgba(255, 255, 255, 0.06) 45%, transparent 75%)';
              shine.style.opacity = '1';
            }
          });
        });

        card.addEventListener('mouseleave', function () {
          if (rafId) cancelAnimationFrame(rafId);
          card.style.willChange = 'auto';
          card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.3, 1), box-shadow 0.5s cubic-bezier(0.2, 0.8, 0.3, 1)';
          card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0)';
          card.style.boxShadow = '0 14px 32px -16px rgba(62, 0, 32, 0.08)';
          if (shine) {
            shine.style.opacity = '0';
          }
        });
      });
    }

    // 3. 3D Tilt for Video Cards (max tilt 7deg, video parallax in opposite direction up to 10px)
    var tiltVideoCards = counterSec.querySelectorAll('[data-tilt-video]');
    if (!isTouch && !prefersReduced) {
      tiltVideoCards.forEach(function (card) {
        var shine = card.querySelector('.card-3d-shine');
        var rafId = null;

        card.addEventListener('mouseenter', function () {
          card.style.willChange = 'transform, box-shadow';
          card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
        });

        card.addEventListener('mousemove', function (e) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(function () {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;

            // Max tilt ~7deg
            var rotX = ((centerY - y) / centerY) * 7.0;
            var rotY = ((x - centerX) / centerX) * 7.0;

            card.style.transform = 'perspective(1100px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
            card.style.boxShadow = (-rotY * 2.0).toFixed(1) + 'px ' + (rotX * 2.0 + 22).toFixed(1) + 'px 40px -10px rgba(62, 0, 32, 0.20)';

            // Parallax shift video in opposite direction (up to ~10px)
            var vidPx = (-rotY * 1.4).toFixed(1);
            var vidPy = (rotX * 1.4).toFixed(1);
            card.style.setProperty('--vid-px', vidPx + 'px');
            card.style.setProperty('--vid-py', vidPy + 'px');

            if (shine) {
              var shineX = ((x / rect.width) * 100).toFixed(1);
              var shineY = ((y / rect.height) * 100).toFixed(1);
              shine.style.background = 'radial-gradient(circle 350px at ' + shineX + '% ' + shineY + '%, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.08) 45%, transparent 75%)';
              shine.style.opacity = '1';
            }
          });
        });

        card.addEventListener('mouseleave', function () {
          if (rafId) cancelAnimationFrame(rafId);
          card.style.willChange = 'auto';
          card.style.transition = 'transform 0.55s cubic-bezier(0.2, 0.8, 0.3, 1), box-shadow 0.55s cubic-bezier(0.2, 0.8, 0.3, 1)';
          card.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)';
          card.style.setProperty('--vid-px', '0px');
          card.style.setProperty('--vid-py', '0px');
          card.style.boxShadow = '0 14px 32px -16px rgba(62, 0, 32, 0.08)';
          if (shine) {
            shine.style.opacity = '0';
          }
        });
      });
    }
  }



  // ==========================================================================
  // Section 6: Café Menu - Two-Column Single-Screen Layout (#menu.cafe-orbit)
  // - Left: 3D Video circle with golden circular ripple & 1 decorative text ring
  // - Right: Full legible menu list (names, dotted leaders, prices, units)
  // - Pills + Arrows + Counter in 1 bottom row, 90px WhatsApp clearance
  // ==========================================================================
  function initCafeOrbit() {
    var secEl = document.getElementById('menu');
    if (!secEl) return;

    var circleSystem = document.getElementById('cafe-circle-system');
    var singleTextPath = document.getElementById('cafe-single-textpath');

    var portalCurLayer = document.getElementById('portal-layer-cur');
    var portalNextLayer = document.getElementById('portal-layer-next');
    var portalCurVideo = document.getElementById('portal-video-cur');
    var cafeBgVideo = document.getElementById('cafe-bg-video');
    var portalNextVideo = document.getElementById('portal-video-next');
    var portalCurPoster = document.getElementById('portal-poster-cur');
    var portalNextPoster = document.getElementById('portal-poster-next');

    var menuHeader = document.getElementById('cafe-menu-header');
    var activeTitleEl = document.getElementById('cafe-active-title');
    var activeCaptionEl = document.getElementById('cafe-active-caption');
    var menuListEl = document.getElementById('cafe-menu-list');

    var tabBtns = secEl.querySelectorAll('.cafe-tab-btn');
    var counterCurEl = document.getElementById('cafe-counter-cur');
    var prevBtn = document.getElementById('cafe-prev');
    var nextBtn = document.getElementById('cafe-next');

    if (!circleSystem || !portalCurVideo || !menuListEl) return;

    var CAFE_DATA = [
      {
        id: 'chaat',
        title: 'Special Chaat',
        caption: 'Crisp puri filled with spiced mint water & potato filling',
        video: 'assets/Cafe/Green_water_pouring_on_puri_7ad784e6.mp4',
        poster: 'assets/Cafe/poster-chaat.webp',
        ringText: 'SPECIAL CHAAT • CRISP & LIVE • PURE VEGETARIAN • SPECIAL CHAAT • CRISP & LIVE • PURE VEGETARIAN • ',
        items: [
          { name: 'Paani Puri (6 pcs)', price: '₹65' },
          { name: 'Suji Gol Gappa (6 pcs)', price: '₹75' },
          { name: 'Bhel Puri', price: '₹95' },
          { name: 'Masala Puri', price: '₹95' },
          { name: 'Dahi Puri', price: '₹100' },
          { name: 'Sev Puri', price: '₹100' },
          { name: 'Samosa Chaat', price: '₹100' },
          { name: 'Samosa Dahi Chaat', price: '₹120' },
          { name: 'Papdi Chaat', price: '₹120' }
        ]
      },
      {
        id: 'snacks',
        title: 'Snacks & Savouries',
        caption: 'Crisp golden crusts with spiced fragrant fillings',
        video: 'assets/Cafe/Chutney_drizzling_over_samosa_41d23478.mp4',
        poster: 'assets/Cafe/poster-snacks.webp',
        ringText: 'SNACKS & SAVOURIES • FRESH & LIVE • PURE VEGETARIAN • SNACKS & SAVOURIES • FRESH & LIVE • ',
        items: [
          { name: 'Samosa', price: '₹35', unit: 'per pc' },
          { name: 'Dal Kachori', price: '₹35', unit: 'per pc' },
          { name: 'Paneer Samosa', price: '₹40', unit: 'per pc' },
          { name: 'Onion Kachori', price: '₹40', unit: 'per pc' },
          { name: 'Plain Dhokla', price: '₹40', unit: 'per plate' },
          { name: 'Khandvi Roll (2 pcs)', price: '₹45', unit: 'per plate' },
          { name: 'Vada Pav', price: '₹45', unit: 'per pc' }
        ]
      },
      {
        id: 'special',
        title: 'Amaska Special',
        caption: 'Fluffy kulcha served with slow-simmered Amritsari chole',
        video: 'assets/Cafe/Butter_pouring_on_hot_kulcha_53425cdf.mp4',
        poster: 'assets/Cafe/poster-special.webp',
        ringText: 'AMASKA SPECIAL • CRISP & LIVE • PURE VEGETARIAN • AMASKA SPECIAL • CRISP & LIVE • PURE VEG • ',
        items: [
          { name: 'Aloo Tikki with Dahi', price: '₹120' },
          { name: 'Aloo Tikki with Chole', price: '₹130' },
          { name: 'Raj Kachori', price: '₹130' },
          { name: 'Pav Bhaji', price: '₹150' },
          { name: 'Chole Kulcha', price: '₹180' },
          { name: 'Chole Bhature', price: '₹190' }
        ]
      }
    ];

    var currentIndex = 0;
    var totalCategories = CAFE_DATA.length;
    var isTransitioning = false;
    var autoTimer = null;
    var isHovered = false;
    var isSectionInView = true;
    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Render Items in the Right Column Menu List
    function renderMenuList(catIndex) {
      var cat = CAFE_DATA[catIndex];
      var html = '';
      cat.items.forEach(function (item, idx) {
        var delay = (idx * 0.035).toFixed(3);
        html += '<li class="cafe-item-row" style="animation-delay: ' + delay + 's;">';
        html += '<span class="item-name">' + item.name + '</span>';
        html += '<span class="item-leader" aria-hidden="true"></span>';
        html += '<div class="item-price-wrap">';
        html += '<span class="item-price-val">' + item.price + '</span>';
        if (item.unit) {
          html += '<span class="item-unit">' + item.unit + '</span>';
        }
        html += '</div></li>';
      });
      menuListEl.innerHTML = html;
    }

    // Video playing listener for seamless poster hide
    function setupVideoListener(video, layer) {
      if (!video) return;
      var markPlaying = function () {
        layer.classList.add('is-video-playing');
      };
      video.addEventListener('playing', markPlaying, { passive: true });
      video.addEventListener('timeupdate', function () {
        if (video.currentTime > 0.1) markPlaying();
      }, { passive: true });
    }
    setupVideoListener(portalCurVideo, portalCurLayer);
    setupVideoListener(portalNextVideo, portalNextLayer);

    // Switch Category function with 900ms golden circular ripple
    function goToCategory(targetIdx, dir) {
      if (isTransitioning) return;
      targetIdx = (targetIdx + totalCategories) % totalCategories;
      if (targetIdx === currentIndex) return;

      isTransitioning = true;
      var nextData = CAFE_DATA[targetIdx];

      // 1. Update Tabs & Counter
      tabBtns.forEach(function (btn, idx) {
        var isActive = (idx === targetIdx);
        btn.classList.toggle('is-active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (counterCurEl) {
        counterCurEl.textContent = String(targetIdx + 1).padStart(2, '0');
      }

      // 2. Animate Menu Header & List Items (Staggered Fade/Slide)
      if (menuHeader) {
        menuHeader.classList.add('is-fading');
        setTimeout(function () {
          if (activeTitleEl) activeTitleEl.textContent = nextData.title;
          if (activeCaptionEl) activeCaptionEl.textContent = nextData.caption;
          renderMenuList(targetIdx);
          menuHeader.classList.remove('is-fading');
        }, 220);
      } else {
        renderMenuList(targetIdx);
      }

      // 3. Update Single Decorative Ring Text
      if (singleTextPath) {
        singleTextPath.style.opacity = '0.3';
        setTimeout(function () {
          singleTextPath.textContent = nextData.ringText;
          singleTextPath.style.opacity = '1';
        }, 280);
      }

      // 4. Video Portal Golden Circular Ripple Transition
      if (prefersReducedMotion) {
        portalCurVideo.src = nextData.video;
        portalCurPoster.src = nextData.poster;
        portalCurLayer.classList.remove('is-video-playing');
        portalCurVideo.play().catch(function () {});
        currentIndex = targetIdx;
        isTransitioning = false;
        preloadNextVideo();
      } else {
        portalNextLayer.classList.remove('is-video-playing');
        portalNextPoster.src = nextData.poster;
        portalNextVideo.src = nextData.video;
        portalNextVideo.currentTime = 0;
        var playPromise = portalNextVideo.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {});
        }

        // Trigger circular ripple inside plate opening
        void portalNextLayer.offsetWidth; // force reflow
        portalNextLayer.classList.add('is-rippling');

        // Soft gold pulse along the flower mandala frame during category change
        var mandalaFrame = document.getElementById('cafe-mandala-frame');
        if (mandalaFrame) {
          mandalaFrame.classList.remove('is-pulsing');
          void mandalaFrame.offsetWidth;
          mandalaFrame.classList.add('is-pulsing');
          setTimeout(function () {
            mandalaFrame.classList.remove('is-pulsing');
          }, 950);
        }

        setTimeout(function () {
          portalCurLayer.classList.remove('is-video-playing');
          portalCurPoster.src = nextData.poster;
          portalCurVideo.src = nextData.video;
          portalCurVideo.currentTime = portalNextVideo.currentTime;
          portalCurVideo.play().catch(function () {});

          portalNextLayer.classList.remove('is-rippling');
          portalNextVideo.pause();
          portalNextVideo.removeAttribute('src');
          portalNextVideo.load();

          currentIndex = targetIdx;
          isTransitioning = false;
          preloadNextVideo();
        }, 900);
      }
    }

    // Preload next upcoming video
    function preloadNextVideo() {
      var nextIdx = (currentIndex + 1) % totalCategories;
      var preloadVid = document.createElement('video');
      preloadVid.preload = 'auto';
      preloadVid.src = CAFE_DATA[nextIdx].video;
    }

    // Auto-advance every 9 seconds
    function startAutoAdvance() {
      if (prefersReducedMotion || autoTimer || isHovered || !isSectionInView) return;
      autoTimer = setInterval(function () {
        goToCategory(currentIndex + 1, 1);
      }, 9000);
    }

    function stopAutoAdvance() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    // Interactive Controls: Tabs
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.dataset.index, 10);
        goToCategory(idx, idx > currentIndex ? 1 : -1);
      });
    });

    // Arrow Controls
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goToCategory(currentIndex - 1, -1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goToCategory(currentIndex + 1, 1);
      });
    }

    // Keyboard Left / Right Navigation on Section
    secEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToCategory(currentIndex - 1, -1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToCategory(currentIndex + 1, 1);
      }
    });

    // Touch Swipe Controls
    var touchStartX = 0;
    var touchStartY = 0;
    secEl.addEventListener('touchstart', function (e) {
      if (e.touches && e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
      stopAutoAdvance();
    }, { passive: true });

    secEl.addEventListener('touchend', function (e) {
      if (e.changedTouches && e.changedTouches.length > 0) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx < 0) {
            goToCategory(currentIndex + 1, 1);
          } else {
            goToCategory(currentIndex - 1, -1);
          }
        }
      }
      startAutoAdvance();
    }, { passive: true });

    // Hover & Focus: Pause auto-advance
    secEl.addEventListener('mouseenter', function () {
      isHovered = true;
      stopAutoAdvance();
    });
    secEl.addEventListener('mouseleave', function () {
      isHovered = false;
      startAutoAdvance();
    });

    // 3D Mouse Tilt on Left Circle Portal (up to 6deg, desktop only)
    if (!prefersReducedMotion && window.innerWidth > 768) {
      var tiltRaf = null;
      var circleCol = secEl.querySelector('.cafe-col-circle');
      if (circleCol) {
        circleCol.addEventListener('mousemove', function (e) {
          if (tiltRaf) cancelAnimationFrame(tiltRaf);
          tiltRaf = requestAnimationFrame(function () {
            var rect = circleCol.getBoundingClientRect();
            var xNorm = (e.clientX - rect.left) / rect.width - 0.5;
            var yNorm = (e.clientY - rect.top) / rect.height - 0.5;
            var tiltX = (-yNorm * 6).toFixed(2);
            var tiltY = (xNorm * 6).toFixed(2);
            circleSystem.style.transform = 'perspective(1200px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
          });
        });

        circleCol.addEventListener('mouseleave', function () {
          if (tiltRaf) cancelAnimationFrame(tiltRaf);
          circleSystem.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
        });
      }
    }

    // IntersectionObserver: play video, auto-advance & rotate animations only in view
    var cafeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isSectionInView = entry.isIntersecting;
        secEl.classList.toggle('is-in-view', isSectionInView);
        if (isSectionInView) {
          if (!prefersReducedMotion) {
            if (portalCurVideo) {
              var p = portalCurVideo.play();
              if (p !== undefined) p.catch(function () {});
            }
            if (cafeBgVideo) {
              var pb = cafeBgVideo.play();
              if (pb !== undefined) pb.catch(function () {});
            }
          }
          startAutoAdvance();
        } else {
          stopAutoAdvance();
          if (portalCurVideo) portalCurVideo.pause();
          if (cafeBgVideo) cafeBgVideo.pause();
        }
      });
    }, { threshold: 0.15 });
    cafeObserver.observe(secEl);

    // Initial Render (Observer will start video & auto-advance when scrolled into view)
    renderMenuList(0);
    if (secEl.getBoundingClientRect().top < (window.innerHeight || 800) && secEl.getBoundingClientRect().bottom > 0) {
      isSectionInView = true;
      secEl.classList.add('is-in-view');
      startAutoAdvance();
      if (!prefersReducedMotion) {
        if (portalCurVideo) portalCurVideo.play().catch(function () {});
        if (cafeBgVideo) cafeBgVideo.play().catch(function () {});
      }
    }
  }

  // ==========================================================================
  // Section 7: Compact Footer Engine (#visit.site-footer)
  // - Diya embers, sparks, drifting saffron & pistachio particles
  // - Strict keep-out zones with 12px margin around all text blocks
  // - Background subtle flame glow beside logo symbol (never touches letters)
  // - Big faint rotating mandala with mouse parallax (lowered opacity)
  // - Live "Open now / Closed" status computed from India Standard Time (IST)
  // - Scroll reveal trigger with pause when out of view
  // ==========================================================================
  function initCompactFooter() {
    var footerEl = document.getElementById('visit');
    if (!footerEl) return;

    var canvas = document.getElementById('footer-embers-canvas');
    var mandala = document.getElementById('footer-mandala-bg');
    var statusDot = document.getElementById('footer-status-dot');
    var statusText = document.getElementById('footer-status-text');

    var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isFooterInView = false;

    // 1. Live IST Open/Closed Status
    if (statusDot && statusText) {
      function updateStoreStatus() {
        var now = new Date();
        var utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        var ist = new Date(utc + (3600000 * 5.5));
        var mins = ist.getHours() * 60 + ist.getMinutes();
        var isOpen = (mins >= 540 && mins < 1350);
        if (isOpen) {
          statusDot.className = 'status-dot is-open';
          statusText.textContent = 'Open now · until 10:30 PM';
        } else {
          statusDot.className = 'status-dot is-closed';
          statusText.textContent = 'Closed · opens 9:00 AM';
        }
      }
      updateStoreStatus();
      setInterval(updateStoreStatus, 60000);
    }

    // 2. Visible Footer Animations: Flame by Logo, 12 Twinkling Stars, 6 Drifting Pieces
    var emberAnimationId = null;
    if (canvas && !prefersReducedMotion) {
      var ctx = canvas.getContext('2d');
      var width = 0;
      var height = 0;
      var keepOutZones = [];
      var logoSymbolBox = null;
      var flamePhase = 0;

      // Keep-Out Zones: 12px margin around all text blocks, buttons, and links
      function updateKeepOutZones() {
        if (!footerEl || !canvas) return;
        var fRect = footerEl.getBoundingClientRect();
        keepOutZones = [];

                var selectors = [
          '.footer-col-brand',
          '.footer-logo-wordmark',
          '.footer-logo-kannada',
          '.footer-tagline',
          '.footer-address',
          '.footer-col-contact',
          '.footer-maps-btn',
          '.footer-bottom',
          '.footer-copy'
        ];

        var margin = 12; // 12px safety margin
        for (var s = 0; s < selectors.length; s++) {
          var el = footerEl.querySelector(selectors[s]);
          if (!el) continue;
          var r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            keepOutZones.push({
              left: r.left - fRect.left - margin,
              top: r.top - fRect.top - margin,
              right: r.right - fRect.left + margin,
              bottom: r.bottom - fRect.top + margin
            });
          }
        }

        // Logo symbol position for the flame & warm glow
        var symEl = footerEl.querySelector('.footer-logo-symbol');
        if (symEl) {
          var sRect = symEl.getBoundingClientRect();
          logoSymbolBox = {
            cx: (sRect.left + sRect.right) / 2 - fRect.left,
            cy: (sRect.top + sRect.bottom) / 2 - fRect.top,
            r: sRect.width / 2
          };
        }
      }

      function isInsideKeepOut(x, y) {
        for (var i = 0; i < keepOutZones.length; i++) {
          var b = keepOutZones[i];
          if (x >= b.left && x <= b.right && y >= b.top && y <= b.bottom) {
            return true;
          }
        }
        return false;
      }

      function resizeCanvas() {
        if (!canvas || !footerEl) return;
        var fRect = footerEl.getBoundingClientRect();
        width = canvas.width = footerEl.clientWidth || Math.round(fRect.width) || window.innerWidth;
        height = canvas.height = footerEl.clientHeight || Math.round(fRect.height) || 260;
        updateKeepOutZones();
      }
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas, { passive: true });

      // 12 Twinkling Stars (4 to 7px, opacity up to 1.0)
      var stars = [];
      var numStars = 12;

      function spawnStarLocation() {
        for (var attempt = 0; attempt < 25; attempt++) {
          var x = 0;
          var roll = Math.random();
          if (roll < 0.55) {
            // Over mandala and right empty background
            x = width * 0.62 + Math.random() * (width * 0.38);
          } else if (roll < 0.85) {
            // Left empty background
            x = Math.random() * (width * 0.22);
          } else {
            // Gaps between columns
            x = width * 0.38 + Math.random() * (width * 0.26);
          }
          var y = Math.random() * height;
          if (!isInsideKeepOut(x, y)) {
            return { x: x, y: y };
          }
        }
        return { x: width * 0.75 + Math.random() * (width * 0.22), y: Math.random() * height };
      }

      function createStar(initial) {
        var pos = spawnStarLocation();
        var r = 2.0 + Math.random() * 1.5; // diameter 4 to 7px
        return {
          x: pos.x,
          y: initial ? pos.y : height + 5 + Math.random() * 15,
          r: r,
          speedY: -0.15 - Math.random() * 0.25,
          driftAmp: 0.15 + Math.random() * 0.25,
          angle: Math.random() * Math.PI * 2,
          driftSpeed: 0.02 + Math.random() * 0.02,
          maxAlpha: 0.75 + Math.random() * 0.25, // opacity up to 1.0
          twinkleSpeed: 0.035 + Math.random() * 0.045,
          phase: Math.random() * Math.PI * 2
        };
      }

      for (var s = 0; s < numStars; s++) {
        stars.push(createStar(true));
      }

      // 6 Drifting Pieces (8 to 12px, opacity up to 0.7)
      var pieces = [];
      var numPieces = 6;

      function spawnPieceLocation() {
        for (var attempt = 0; attempt < 25; attempt++) {
          var x = 0;
          var roll = Math.random();
          if (roll < 0.40) {
            // Far left edge
            x = Math.random() * Math.max(80, width * 0.18);
          } else if (roll < 0.75) {
            // Far right edge
            x = width - Math.random() * Math.max(90, width * 0.22);
          } else {
            // Column gaps
            x = width * 0.35 + Math.random() * (width * 0.32);
          }
          var y = Math.random() * height;
          if (!isInsideKeepOut(x, y)) {
            return { x: x, y: y };
          }
        }
        return { x: Math.random() < 0.5 ? 40 : width - 40, y: Math.random() * height };
      }

      function createPiece(initial, index) {
        var pos = spawnPieceLocation();
        var type = (index % 2 === 0) ? 'saffron' : 'pistachio';
        var len = 8.0 + Math.random() * 4.0; // 8 to 12px
        return {
          type: type,
          x: pos.x,
          y: initial ? pos.y : height + 10 + Math.random() * 20,
          len: len,
          curve: (Math.random() - 0.5) * 4,
          speedY: -0.22 - Math.random() * 0.30,
          driftAmp: 0.35 + Math.random() * 0.45,
          angle: Math.random() * Math.PI * 2,
          driftSpeed: 0.015 + Math.random() * 0.025,
          rotation: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.03,
          maxAlpha: 0.55 + Math.random() * 0.15, // opacity up to 0.70
          alpha: 0.55 + Math.random() * 0.15
        };
      }

      for (var p = 0; p < numPieces; p++) {
        pieces.push(createPiece(true, p));
      }

      // Main Canvas Render Loop
      function renderEmbers() {
        if (!isFooterInView) return;
        if (width === 0 || height === 0) resizeCanvas();
        ctx.clearRect(0, 0, width, height);

        // A. Tiny Flickering Flame by Logo with 56px Warm Glow (Opacity 0.5)
        if (logoSymbolBox) {
          flamePhase += 0.08;
          var flameFlicker = 0.90 + 0.10 * Math.sin(flamePhase * 3.7) * Math.cos(flamePhase * 2.1);
          var flameWanderX = Math.sin(flamePhase * 1.5) * 1.2;
          var flameScaleY = 1.0 + Math.sin(flamePhase * 4.3) * 0.08;

          // Flame sits right at top apex of the diya logo emblem
          var fx = logoSymbolBox.cx;
          var fy = logoSymbolBox.cy - logoSymbolBox.r + 2;

          // 56px Warm Glow (radius 28px) at opacity 0.5
          var glow = ctx.createRadialGradient(fx, fy, 2, fx, fy, 28);
          glow.addColorStop(0, 'rgba(255, 215, 90, ' + (0.50 * flameFlicker) + ')');
          glow.addColorStop(0.35, 'rgba(235, 140, 30, ' + (0.35 * flameFlicker) + ')');
          glow.addColorStop(0.70, 'rgba(212, 100, 20, ' + (0.18 * flameFlicker) + ')');
          glow.addColorStop(1, 'rgba(58, 0, 32, 0)');

          ctx.beginPath();
          ctx.arc(fx, fy, 28, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // 14px Wide Teardrop Diya Flame Body
          ctx.save();
          ctx.translate(fx + flameWanderX, fy);
          ctx.scale(1, flameScaleY);
          ctx.beginPath();
          ctx.moveTo(0, -13); // flame tip
          ctx.bezierCurveTo(7, -4, 7, 5, 0, 7); // right curve (width 14px)
          ctx.bezierCurveTo(-7, 5, -7, -4, 0, -13); // left curve
          var flameGrad = ctx.createLinearGradient(0, -13, 0, 7);
          flameGrad.addColorStop(0, 'rgba(255, 255, 220, 0.95)');
          flameGrad.addColorStop(0.35, 'rgba(255, 205, 60, 0.90)');
          flameGrad.addColorStop(0.75, 'rgba(235, 120, 20, 0.85)');
          flameGrad.addColorStop(1, 'rgba(180, 50, 10, 0.4)');
          ctx.fillStyle = flameGrad;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 215, 90, 0.8)';
          ctx.fill();
          ctx.restore();
        }

        // B. 12 Twinkling Gold Stars (4 to 7px, opacity up to 1.0)
        for (var i = 0; i < stars.length; i++) {
          var st = stars[i];
          st.y += st.speedY;
          st.angle += st.driftSpeed;
          st.x += Math.sin(st.angle) * st.driftAmp;
          st.phase += st.twinkleSpeed;

          // Check keep-out zone: fade rapidly if entering text box
          if (isInsideKeepOut(st.x, st.y)) {
            st.maxAlpha *= 0.80;
            if (st.maxAlpha < 0.02) {
              stars[i] = createStar(false);
            }
            continue;
          }

          var starAlpha = Math.max(0.2, Math.min(1.0, st.maxAlpha * (0.65 + 0.35 * Math.sin(st.phase))));

          // Draw 4-pointed diamond star sparkle
          ctx.save();
          ctx.translate(st.x, st.y);
          ctx.beginPath();
          var ray = st.r * 1.6;
          ctx.moveTo(0, -ray);
          ctx.quadraticCurveTo(0, 0, ray, 0);
          ctx.quadraticCurveTo(0, 0, 0, ray);
          ctx.quadraticCurveTo(0, 0, -ray, 0);
          ctx.quadraticCurveTo(0, 0, 0, -ray);
          ctx.fillStyle = 'rgba(255, 220, 110, ' + starAlpha + ')';
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(255, 235, 140, ' + starAlpha + ')';
          ctx.fill();

          // Bright center core
          ctx.beginPath();
          ctx.arc(0, 0, st.r * 0.45, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 240, ' + starAlpha + ')';
          ctx.fill();
          ctx.restore();

          // Respawn at bottom when off screen
          if (st.y < -15 || st.x < -20 || st.x > width + 20) {
            stars[i] = createStar(false);
          }
        }

        // C. 6 Drifting Pieces (8 to 12px, opacity up to 0.70)
        for (var j = 0; j < pieces.length; j++) {
          var pc = pieces[j];
          pc.y += pc.speedY;
          pc.angle += pc.driftSpeed;
          pc.x += Math.sin(pc.angle) * pc.driftAmp;
          pc.rotation += pc.spinSpeed;

          // Check keep-out zone
          if (isInsideKeepOut(pc.x, pc.y)) {
            pc.alpha *= 0.80;
            if (pc.alpha < 0.02) {
              pieces[j] = createPiece(false, j);
            }
            continue;
          }

          var curAlpha = Math.max(0, Math.min(0.70, pc.alpha));

          if (pc.type === 'saffron') {
            // Saffron thread (8 to 12px)
            ctx.save();
            ctx.translate(pc.x, pc.y);
            ctx.rotate(pc.rotation);
            ctx.beginPath();
            ctx.moveTo(-pc.len / 2, 0);
            ctx.quadraticCurveTo(0, pc.curve, pc.len / 2, 0);
            ctx.strokeStyle = 'rgba(235, 105, 20, ' + curAlpha + ')';
            ctx.lineWidth = 2.0;
            ctx.lineCap = 'round';
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(235, 110, 25, 0.45)';
            ctx.stroke();
            ctx.restore();
          } else {
            // Pistachio sliver (8 to 12px)
            ctx.save();
            ctx.translate(pc.x, pc.y);
            ctx.rotate(pc.rotation);
            ctx.beginPath();
            ctx.ellipse(0, 0, pc.len / 2, pc.len / 3.8, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(164, 208, 88, ' + curAlpha + ')';
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(164, 208, 88, 0.45)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(214, 180, 50, ' + (curAlpha * 0.6) + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
            ctx.restore();
          }

          // Respawn at bottom when off screen
          if (pc.y < -15 || pc.x < -20 || pc.x > width + 20) {
            pieces[j] = createPiece(false, j);
          }
        }

        emberAnimationId = requestAnimationFrame(renderEmbers);
      }

      function startEmbers() {
        resizeCanvas();
        updateKeepOutZones();
        if (!emberAnimationId) {
          emberAnimationId = requestAnimationFrame(renderEmbers);
        }
      }

      function stopEmbers() {
        if (emberAnimationId) {
          cancelAnimationFrame(emberAnimationId);
          emberAnimationId = null;
        }
      }
    }

    // 3. Mandala Mouse Parallax (Desktop Only)
    if (mandala && !prefersReducedMotion && window.innerWidth > 960) {
      var mandalaRaf = null;
      footerEl.addEventListener('mousemove', function (e) {
        if (mandalaRaf) cancelAnimationFrame(mandalaRaf);
        mandalaRaf = requestAnimationFrame(function () {
          var rect = footerEl.getBoundingClientRect();
          var xNorm = (e.clientX - rect.left) / rect.width - 0.5;
          var yNorm = (e.clientY - rect.top) / rect.height - 0.5;
          var px = (-xNorm * 10).toFixed(1);
          var py = (-yNorm * 10).toFixed(1);
          footerEl.style.setProperty('--mandala-px', px + 'px');
          footerEl.style.setProperty('--mandala-py', py + 'px');
        });
      }, { passive: true });

      footerEl.addEventListener('mouseleave', function () {
        if (mandalaRaf) cancelAnimationFrame(mandalaRaf);
        footerEl.style.setProperty('--mandala-px', '0px');
        footerEl.style.setProperty('--mandala-py', '0px');
      });
    }

    // 4. Reveal & IntersectionObserver (Pauses when footer is out of view)
    var footerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        isFooterInView = entry.isIntersecting;
        if (isFooterInView) {
          footerEl.classList.add('is-revealed');
          if (typeof startEmbers === 'function') startEmbers();
        } else {
          if (typeof stopEmbers === 'function') stopEmbers();
        }
      });
    }, { threshold: 0.1 });
    footerObserver.observe(footerEl);

    // Initial check in case footer is already in viewport on load (e.g. #visit link)
    var initialRect = footerEl.getBoundingClientRect();
    if (initialRect.top < window.innerHeight && initialRect.bottom > 0) {
      isFooterInView = true;
      footerEl.classList.add('is-revealed');
      if (typeof startEmbers === 'function') startEmbers();
    }
  }

  // Initialize interactive components independently with try/catch isolation
  function initAllSections() {
    try {
      initSweetsCoverflow();
    } catch (err) {
      console.error('Failed to initialize Sweets Coverflow:', err);
    }

    try {
      initGiftBoxes();
    } catch (err) {
      console.error('Failed to initialize Gift Boxes:', err);
    }

    try {
      initCounterSection();
    } catch (err) {
      console.error('Failed to initialize Counter Section:', err);
    }

    try {
      initCafeOrbit();
    } catch (err) {
      console.error('Failed to initialize Café Orbit:', err);
    }

    try {
      initCompactFooter();
    } catch (err) {
      console.error('Failed to initialize Compact Footer:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllSections);
  } else {
    initAllSections();
  }

})();
