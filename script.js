/**
 * ============================================================
 * RETRO PORTFOLIO — script.js
 * Handles: typewriter, scroll reveal, navbar, mobile menu,
 *          back-to-top, dynamic year, keyboard nav.
 * No frameworks — pure Vanilla JS.
 * ============================================================
 */

/* ─── WAIT FOR DOM ─────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. DYNAMIC YEAR ───────────────────────────────────── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ── 2. TYPEWRITER ANIMATION ───────────────────────────── */
  /**
   * Cycles through an array of tagline sentences, typing them
   * character-by-character into #heroTagline, then erasing.
   *
   * ★ REPLACE: Edit the `sentences` array below to customise
   *            your hero tagline.
   */
  const typewriterEl = document.getElementById('heroTagline');

  if (typewriterEl) {
    // ★ REPLACE: your tagline sentences here
    const sentences = [
      "Full-Stack Developer crafting bold, functional web apps.",
      "Python & Django enthusiast with an eye for design.",
      "Turning ideas into polished digital experiences.",
    ];

    let sentenceIndex = 0;
    let charIndex     = 0;
    let isDeleting    = false;

    // Preserve the cursor span so we can reattach it
    const cursor = typewriterEl.querySelector('.typewriter-cursor');

    // Typing speeds (ms)
    const SPEED_TYPE   = 55;   // ms per character when typing
    const SPEED_DELETE = 28;   // ms per character when deleting
    const PAUSE_END    = 1800; // pause at end of sentence
    const PAUSE_START  = 400;  // pause before re-typing

    /** Set visible text without removing the cursor element */
    function setText(text) {
      // Remove any existing text nodes
      Array.from(typewriterEl.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.remove();
      });
      // Prepend new text node
      typewriterEl.insertBefore(document.createTextNode(text), cursor);
    }

    function tick() {
      const currentSentence = sentences[sentenceIndex];

      if (!isDeleting) {
        // ── Typing ──
        charIndex++;
        setText(currentSentence.substring(0, charIndex));

        if (charIndex === currentSentence.length) {
          // Finished typing — pause then start deleting
          isDeleting = true;
          setTimeout(tick, PAUSE_END);
          return;
        }
        setTimeout(tick, SPEED_TYPE);

      } else {
        // ── Deleting ──
        charIndex--;
        setText(currentSentence.substring(0, charIndex));

        if (charIndex === 0) {
          // Finished deleting — move to next sentence
          isDeleting = false;
          sentenceIndex = (sentenceIndex + 1) % sentences.length;
          setTimeout(tick, PAUSE_START);
          return;
        }
        setTimeout(tick, SPEED_DELETE);
      }
    }

    // Small initial delay so the page loads before typing starts
    setTimeout(tick, 600);
  }


  /* ── 3. SCROLL-TRIGGERED REVEAL (IntersectionObserver) ─── */
  /**
   * Adds the `.visible` class to elements with `.reveal` or
   * `.reveal-stagger` as they enter the viewport, triggering
   * CSS fade/slide-in transitions defined in style.css.
   */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after first reveal to save resources
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,       // trigger when 12% of the element is visible
      rootMargin: '0px 0px -40px 0px', // slight bottom offset
    }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ── 4. NAVBAR — scroll class & active link highlight ──── */
  const navbar = document.querySelector('.navbar');

  // Add `.scrolled` class after a short scroll (for shadow styling)
  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load


  /* ── 5. MOBILE HAMBURGER MENU ──────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {

    /** Open / close the mobile menu */
    function toggleMenu(forceClose = false) {
      const isOpen = navLinks.classList.contains('open');

      if (forceClose || isOpen) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      } else {
        navLinks.classList.add('open');
        navToggle.classList.add('open');
        navToggle.setAttribute('aria-expanded', 'true');
      }
    }

    navToggle.addEventListener('click', () => toggleMenu());

    // Close menu when any nav link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });

    // Close menu on outside click / tap
    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
        toggleMenu(true);
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') toggleMenu(true);
    });
  }


  /* ── SMOOTH SCROLL FOR NAV & SECTION LINKS ───────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      if (targetId === '#socials') {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 70;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

        window.scrollTo({
          top: targetTop,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ── BACK TO TOP BUTTON ─────────────────────────────── */
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── 9. PROJECT CARD — ripple click effect ─────────────── */
  /**
   * Adds a brief visual ripple when a project card is clicked,
   * giving tactile feedback that matches the retro theme.
   */
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function (e) {
      // Don't duplicate if clicking directly on a link
      if (e.target.closest('a')) return;

      const link = card.querySelector('a.btn');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href !== '#') {
          window.location.href = href;
        }
      }

      const ripple = document.createElement('span');
      const rect   = card.getBoundingClientRect();

      const size = Math.max(rect.width, rect.height) * 1.5;
      const x    = e.clientX - rect.left - size / 2;
      const y    = e.clientY - rect.top  - size / 2;

      Object.assign(ripple.style, {
        position:     'absolute',
        width:        `${size}px`,
        height:       `${size}px`,
        left:         `${x}px`,
        top:          `${y}px`,
        background:   'rgba(255, 199, 0, 0.12)',
        borderRadius: '50%',
        transform:    'scale(0)',
        transition:   'transform 500ms ease, opacity 500ms ease',
        pointerEvents:'none',
        zIndex:       '0',
      });

      card.appendChild(ripple);

      // Trigger animation
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity   = '0';
      });

      ripple.addEventListener('transitionend', () => ripple.remove());
    });
  });


  /* ── 10. ACTIVE NAV LINK HIGHLIGHT on scroll ───────────── */
  /**
   * Highlights the corresponding nav link as the user scrolls
   * through each section, using IntersectionObserver.
   */
  const sections  = document.querySelectorAll('section[id], footer[id], div[id="socials"]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navAnchors.forEach(a => {
            const isActive = a.getAttribute('href') === `#${id}`;
            a.style.color = isActive ? 'var(--yellow)' : '';
          });
        }
      });
    },
    {
      threshold:  0.3,
      rootMargin: '-80px 0px 0px 0px', // offset for navbar
    }
  );

  sections.forEach(sec => sectionObserver.observe(sec));


  /* ── 11. CONTACT FORM & CONFIRMATION MODAL ──────────────── */
  const contactForm     = document.getElementById('contactForm');
  const contactModal    = document.getElementById('contactModal');
  const modalCloseBtn   = document.getElementById('modalCloseBtn');
  const modalOkBtn      = document.getElementById('modalOkBtn');
  const modalSenderName = document.getElementById('modalSenderName');

  if (contactForm && contactModal) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameVal    = document.getElementById('contactName')?.value.trim() || 'Friend';
      const emailVal   = document.getElementById('contactEmail')?.value.trim();
      const subjectVal = document.getElementById('contactSubject')?.value.trim() || 'General Inquiry';
      const messageVal = document.getElementById('contactMessage')?.value.trim();

      const submitBtn = contactForm.querySelector('.btn-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Email...';
      }

      // Submit directly to email inbox via FormSubmit AJAX API
      fetch('https://formsubmit.co/ajax/write2muhammadbutt@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          subject: subjectVal,
          message: messageVal,
          _subject: `Portfolio Message: ${subjectVal}`
        })
      })
      .then(res => res.json())
      .then(data => {
        if (modalSenderName) {
          modalSenderName.textContent = nameVal;
        }
        contactModal.classList.add('active');
        contactModal.setAttribute('aria-hidden', 'false');
        contactForm.reset();
      })
      .catch(err => {
        console.warn('FormSubmit AJAX fallback triggered:', err);
        if (modalSenderName) {
          modalSenderName.textContent = nameVal;
        }
        contactModal.classList.add('active');
        contactModal.setAttribute('aria-hidden', 'false');
        contactForm.reset();
      })
      .finally(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
      });
    });

    const closeModal = () => {
      contactModal.classList.remove('active');
      contactModal.setAttribute('aria-hidden', 'true');
    };

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalOkBtn)    modalOkBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal();
    });
  }


  /* ── 12. FAQ ACCORDION — Single item open behavior ─────── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.removeAttribute('open');
          }
        });
      }
    });
  });

}); // end DOMContentLoaded

