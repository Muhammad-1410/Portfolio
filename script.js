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
   */
  const typewriterEl = document.getElementById('heroTagline');

  if (typewriterEl) {
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
  /**
   * Custom smooth scroll helper that slows down and eases the scroll animation speed
   * (duration = 1200ms) for a silky, controlled transition across sections.
   */
  function smoothScrollTo(targetPosition, duration = 1200) {
    const startPosition = window.scrollY || window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeInOutCubic(progress);

      window.scrollTo(0, startPosition + distance * easeProgress);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    }

    requestAnimationFrame(animation);
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const navbar = document.querySelector('.navbar');
      const navbarHeight = navbar ? navbar.offsetHeight : 70;
      const targetTop = targetId === '#socials'
        ? target.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (target.offsetHeight / 2)
        : target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      smoothScrollTo(targetTop, 1200);
    });
  });


  /* ── BACK TO TOP BUTTON ─────────────────────────────── */
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      smoothScrollTo(0, 1200);
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
      // Don't duplicate if clicking directly on a link or screenshot wrapper
      if (e.target.closest('a')) return;
      if (e.target.closest('.project-img-wrapper')) return; // handled by lightbox popup

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


  /* ── 11. CONTACT FORM & EMAIL EXISTENCE VALIDATION ──────────── */
  const contactForm     = document.getElementById('contactForm');
  const contactModal    = document.getElementById('contactModal');
  const modalCloseBtn   = document.getElementById('modalCloseBtn');
  const modalOkBtn      = document.getElementById('modalOkBtn');
  const modalSenderName = document.getElementById('modalSenderName');
  const emailInput      = document.getElementById('contactEmail');
  const emailErrorMsg   = document.getElementById('emailErrorMsg');
  const formAlertBanner = document.getElementById('formAlertBanner');

  /**
   * Validates if an email address actually exists and has active MX records.
   * 1. Checks strict RFC format.
   * 2. Detects common typos (gmai.com -> gmail.com).
   * 3. Calls deliverability API (mailcheck.ai).
   * 4. Fallback: Google Public DNS MX record lookup.
   */
  async function validateEmailExistence(email) {
    if (!email) {
      return { valid: false, reason: "Please enter an email address." };
    }

    // 1. Strict RFC 5322 Format Check
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, reason: "Invalid email format. Example: name@example.com" };
    }

    const parts = email.split('@');
    const domain = parts[1].toLowerCase();

    // Common domain typos dictionary
    const domainTypos = {
      'gmai.com': 'gmail.com', 'gmaill.com': 'gmail.com', 'gmil.com': 'gmail.com', 'gmial.com': 'gmail.com',
      'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahi.com': 'yahoo.com',
      'hotmai.com': 'hotmail.com', 'hotmial.com': 'hotmail.com',
      'outloo.com': 'outlook.com', 'outlok.com': 'outlook.com',
      'iclou.com': 'icloud.com'
    };

    if (domainTypos[domain]) {
      const suggestedEmail = `${parts[0]}@${domainTypos[domain]}`;
      return {
        valid: false,
        reason: `Did you mean <strong style="color:var(--yellow);">${suggestedEmail}</strong>? Please check your email for typos.`
      };
    }

    // 2. Real-time Deliverability Check via Mailcheck API
    try {
      const response = await fetch(`https://api.mailcheck.ai/email/${encodeURIComponent(email)}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (response.ok) {
        const data = await response.json();
        if (data.mx === false) {
          return {
            valid: false,
            reason: `The domain "<strong>${domain}</strong>" does not exist or has no active mail server to receive emails.`
          };
        }
        if (data.disposable) {
          return {
            valid: false,
            reason: "Disposable or temporary email addresses are not accepted."
          };
        }
        if (data.did_you_mean) {
          return {
            valid: false,
            reason: `Did you mean <strong>${data.did_you_mean}</strong>?`
          };
        }
        return { valid: true };
      }
    } catch (err) {
      console.warn("Mailcheck API offline/timed out, using DNS lookup fallback:", err);
    }

    // 3. Fallback: Google Public DNS MX Record Lookup
    try {
      const dnsRes = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`, {
        signal: AbortSignal.timeout(4000)
      });
      if (dnsRes.ok) {
        const dnsData = await dnsRes.json();
        // Status 3 = NXDOMAIN (Domain does not exist)
        if (dnsData.Status === 3) {
          return {
            valid: false,
            reason: `The domain "<strong>${domain}</strong>" does not exist.`
          };
        }
        const hasMX = dnsData.Answer && dnsData.Answer.some(rec => rec.type === 15);
        if (!hasMX && (!dnsData.Answer || dnsData.Answer.length === 0)) {
          return {
            valid: false,
            reason: `The domain "<strong>${domain}</strong>" cannot receive emails (no MX mail server found).`
          };
        }
      }
    } catch (err) {
      console.warn("Google DNS API lookup failed:", err);
    }

    // Format is valid and no negative MX signal found
    return { valid: true };
  }

  // Clear email errors when user modifies input
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('input-error');
      if (emailErrorMsg) {
        emailErrorMsg.classList.remove('active');
        emailErrorMsg.innerHTML = '';
      }
      if (formAlertBanner) {
        formAlertBanner.style.display = 'none';
      }
    });
  }

  if (contactForm && contactModal) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal    = document.getElementById('contactName')?.value.trim() || 'Friend';
      const emailVal   = emailInput?.value.trim() || '';
      const subjectVal = document.getElementById('contactSubject')?.value.trim() || 'General Inquiry';
      const messageVal = document.getElementById('contactMessage')?.value.trim() || '';

      const submitBtn  = contactForm.querySelector('.btn-submit');

      // Clear previous error messages & alert banner
      if (emailInput) emailInput.classList.remove('input-error');
      if (emailErrorMsg) {
        emailErrorMsg.classList.remove('active');
        emailErrorMsg.innerHTML = '';
      }
      if (formAlertBanner) {
        formAlertBanner.style.display = 'none';
        formAlertBanner.className = 'form-alert-banner';
      }

      // Step 1: Verify Email Existence
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Verifying Email...';
      }

      const validation = await validateEmailExistence(emailVal);

      if (!validation.valid) {
        if (emailInput) emailInput.classList.add('input-error');
        if (emailErrorMsg) {
          emailErrorMsg.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${validation.reason}`;
          emailErrorMsg.classList.add('active');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
        return; // Stop submission if email does not exist
      }

      // Step 2: Send Email via API
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';
      }

      try {
        const response = await fetch('https://formsubmit.co/ajax/write2muhammadbutt@gmail.com', {
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
        });

        const data = await response.json();

        if (data.success === "true" || data.success === true) {
          if (modalSenderName) {
            modalSenderName.textContent = nameVal;
          }
          contactModal.classList.add('active');
          contactModal.setAttribute('aria-hidden', 'false');
          contactForm.reset();
        } else {
          // FormSubmit returned an issue (e.g. activation pending)
          const errorText = data.message || 'Unable to deliver message at this time.';
          if (formAlertBanner) {
            formAlertBanner.className = 'form-alert-banner warning';
            formAlertBanner.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Form Delivery Notice:</strong> ${errorText}<br><small>If you haven't received emails yet, check <strong>write2muhammadbutt@gmail.com</strong> for the FormSubmit activation link or email directly to <a href="mailto:write2muhammadbutt@gmail.com">write2muhammadbutt@gmail.com</a>.</small>`;
            formAlertBanner.style.display = 'block';
          }
        }
      } catch (err) {
        console.error('Contact form submission error:', err);
        if (formAlertBanner) {
          formAlertBanner.className = 'form-alert-banner error';
          formAlertBanner.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <strong>Connection Error:</strong> Could not reach email service. Please try again or email directly to <a href="mailto:write2muhammadbutt@gmail.com">write2muhammadbutt@gmail.com</a>.`;
          formAlertBanner.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Send Message';
        }
      }
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


  /* ── 13. PROJECT SCREENSHOT LIGHTBOX POPUP ─────────────── */
  // Ensure Lightbox element exists in DOM or inject dynamically
  let lightboxModal = document.getElementById('imageLightboxModal');
  if (!lightboxModal) {
    lightboxModal = document.createElement('div');
    lightboxModal.id = 'imageLightboxModal';
    lightboxModal.className = 'lightbox-modal';
    lightboxModal.setAttribute('aria-hidden', 'true');
    lightboxModal.setAttribute('role', 'dialog');
    lightboxModal.innerHTML = `
      <div class="lightbox-backdrop" id="lightboxBackdrop"></div>
      <div class="lightbox-content">
        <button class="lightbox-close" id="lightboxCloseBtn" aria-label="Close image preview">&times;</button>
        <div class="lightbox-img-container">
          <img id="lightboxImage" src="" alt="Project Screenshot Preview" />
        </div>
        <div class="lightbox-caption" id="lightboxCaption"></div>
      </div>
    `;
    document.body.appendChild(lightboxModal);
  }

  const lightboxImg = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');

  function openLightbox(imgSrc, captionText) {
    if (!lightboxImg || !lightboxModal) return;
    lightboxImg.src = imgSrc;
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || 'Project Screenshot';
      lightboxCaption.style.display = captionText ? 'block' : 'none';
    }
    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach click listener to project screenshots across homepage & detail pages
  const selector = '.project-img-wrapper, .project-img, .main-screenshot-container, .page-card-img-wrapper, [data-lightbox]';
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest(selector);
    if (trigger) {
      e.stopPropagation();
      e.preventDefault();
      const img = trigger.tagName === 'IMG' ? trigger : trigger.querySelector('img');
      if (img && img.src) {
        let caption = img.alt || '';
        const cardTitle = trigger.closest('.project-card, .page-card, main')?.querySelector('.project-title, .page-card-title, .project-detail-title, h3')?.textContent;
        if (cardTitle) {
          caption = cardTitle.trim() + (img.alt && !img.alt.toLowerCase().includes('screenshot') ? ` — ${img.alt}` : '');
        }
        openLightbox(img.src, caption);
      }
    }
  });

}); // end DOMContentLoaded
