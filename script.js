/**
 * ==========================================================================
 * PORTFOLIO CLIENT ENGINE (script.js)
 * Owner: M. Saad M. Sadik Shaikh (Saad)
 * Features:
 *  - Accessible Mobile Navigation Drawer (ARIA, Escape key, Outside-click)
 *  - IntersectionObserver Active Navigation Highlighting
 *  - Scroll-Reveal Engine with prefers-reduced-motion check
 *  - Graceful Image Fallback Controller
 *  - One-Click Email Clipboard Copy with Interactive Feedback
 *  - Dynamic Date & Sticky Header Elevation
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DOM Element Cache
  // --------------------------------------------------------------------------
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const emailCode = document.getElementById('emailCode');
  const heroPhoto = document.getElementById('heroPhoto');
  const fallbackCard = document.getElementById('photoFallbackCard');
  const currentYearSpan = document.getElementById('currentYear');

  // Set dynamic copyright year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Photo Fallback Controller
  // Gracefully handles missing photo (assets/saad.jpg) without broken icon
  // --------------------------------------------------------------------------
  const handlePhotoError = () => {
    if (heroPhoto) {
      heroPhoto.style.display = 'none';
    }
    if (fallbackCard) {
      fallbackCard.classList.add('active');
    }
  };

  if (heroPhoto) {
    // If image has already failed or has zero dimensions
    if (heroPhoto.complete) {
      if (heroPhoto.naturalWidth === 0) {
        handlePhotoError();
      }
    } else {
      heroPhoto.addEventListener('error', handlePhotoError);
    }
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer (Accessible Toggle & Focus Management)
  // --------------------------------------------------------------------------
  const openMobileMenu = () => {
    navMenu.classList.add('is-open');
    navToggle.classList.add('is-active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeMobileMenu = () => {
    navMenu.classList.remove('is-open');
    navToggle.classList.remove('is-active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const toggleMobileMenu = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    if (isExpanded) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close when clicking outside of navbar
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('is-open')) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Close when pressing the Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        closeMobileMenu();
        navToggle.focus();
      }
    });

    // Close when clicking any nav link & set immediate active state
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        if (navMenu.classList.contains('is-open')) {
          closeMobileMenu();
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Sticky Header Elevation on Scroll
  // --------------------------------------------------------------------------
  const handleScrollElevation = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollElevation, { passive: true });
  handleScrollElevation();

  // --------------------------------------------------------------------------
  // 5. Active Section Navigation Highlighting
  // Uses IntersectionObserver with fallback for scroll tracking
  // --------------------------------------------------------------------------
  const navLinkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const targetId = href.substring(1);
      navLinkMap.set(targetId, link);
    }
  });

  if ('IntersectionObserver' in window && sections.length > 0) {
    const sectionObserverOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px', // Trigger when section occupies primary viewing threshold
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach((link) => link.classList.remove('active'));
          const activeLink = navLinkMap.get(currentId);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, sectionObserverOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    // Ensure contact link highlights when scrolled to bottom of document
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 60)) {
        navLinks.forEach((link) => link.classList.remove('active'));
        const contactLink = navLinkMap.get('contact');
        if (contactLink) contactLink.classList.add('active');
      }
    }, { passive: true });
  } else {
    // Fallback scroll listener for legacy environments
    const highlightOnScroll = () => {
      const scrollPos = window.scrollY + 120;
      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const activeLink = navLinkMap.get(id);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    };
    window.addEventListener('scroll', highlightOnScroll, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 6. Scroll-Reveal Engine (Respects prefers-reduced-motion)
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    // Reveal everything immediately if user prefers reduced motion
    revealElements.forEach((el) => el.classList.add('revealed'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Reveal only once for performance
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: Show all
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 7. Email Copy to Clipboard Feature
  // --------------------------------------------------------------------------
  if (copyBtn && emailCode) {
    const originalText = copyBtnText ? copyBtnText.textContent : 'Copy Email';
    
    copyBtn.addEventListener('click', async () => {
      const emailToCopy = emailCode.textContent.trim();
      
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for non-https or older browsers
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        // Visual feedback
        copyBtn.classList.add('copied');
        if (copyBtnText) copyBtnText.textContent = 'Copied to Clipboard!';
        
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyBtnText) copyBtnText.textContent = originalText;
        }, 2500);

      } catch (err) {
        console.error('Failed to copy email:', err);
        if (copyBtnText) copyBtnText.textContent = 'Press Ctrl+C to copy';
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = originalText;
        }, 2000);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. The Hat Rack: Interactive Persona, Theme Switcher & Easter Egg
  // --------------------------------------------------------------------------
  const heroTagline = document.getElementById('heroTagline');
  const hatHintPill = document.getElementById('hatHintPill');
  const hatResetBtn = document.getElementById('hatResetBtn');
  const hatButtons = document.querySelectorAll('.hat-btn');
  const hatStoryCard = document.getElementById('hatStoryCard');
  const storyBadge = document.getElementById('storyBadge');
  const storyTitle = document.getElementById('storyTitle');
  const storyBody = document.getElementById('storyBody');
  const storyFact = document.getElementById('storyFact');
  const storyCloseBtn = document.getElementById('storyCloseBtn');
  const hatEasterEggBanner = document.getElementById('hatEasterEggBanner');
  const easterEggDismissBtn = document.getElementById('easterEggDismissBtn');

  // Safe localStorage helper wrapped in try/catch (Requirement 7)
  const safeStorage = {
    get: (key) => {
      try {
        return window.localStorage.getItem(key);
      } catch (err) {
        return null;
      }
    },
    set: (key, val) => {
      try {
        window.localStorage.setItem(key, val);
      } catch (err) {
        /* storage disabled or blocked */
      }
    },
    remove: (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (err) {
        /* storage disabled or blocked */
      }
    }
  };

  // Hat Persona Definitions (Theme, Story, Tagline & Placeholders)
  const HAT_DATA = {
    builder: {
      badge: 'AWS & AI Architect',
      title: 'The Builder: Engineering at Cloud Scale',
      tagline: 'Engineering scalable AWS cloud backends and cost-governed multi-agent AI systems that turn raw algorithms into production resilience.',
      story: 'I love turning complex algorithmic theory into reliable, scalable systems. As an AWS Student Builder Campus Leader, I spend late nights writing Boto3 scripts, tuning Lambda inference latency, and building guardrails so multi-agent models don\'t spiral into expensive loops. To me, building isn\'t just about writing code—it\'s about creating systems that stay up and perform when the world demands it.',
      fact: 'Spearheading AWS cloud architecture and peer literacy for 500+ student developers across Pune.',
      theme: {
        accent: '#f59e0b',
        accentRgb: '245, 158, 11',
        accentHover: '#d97706',
        accentLight: '#fcd34d',
        accentContrast: '#030712'
      }
    },
    founder: {
      badge: 'AI Saad Services',
      title: 'The Founder: Bootstrapping for Local Businesses',
      tagline: 'Bootstrapping AI Saad Services to bring practical, high-impact artificial intelligence to grassroots businesses across Maharashtra.',
      story: 'With AI Saad Services, I build practical automation for small enterprises across Maharashtra that are usually overlooked by big tech. From automating local billing to building vernacular customer bots, I help neighborhood shops and family ventures deploy AI that solves real daily headaches. Seeing a shop owner save three hours a day is worth a thousand abstract benchmarks.',
      fact: 'Bootstrapped practical AI automation workflows for grassroots retail shops across Maharashtra.',
      theme: {
        accent: '#10b981',
        accentRgb: '16, 185, 129',
        accentHover: '#059669',
        accentLight: '#6ee7b7',
        accentContrast: '#02140c'
      }
    },
    teacher: {
      badge: 'Shivkunj AI Initiative',
      title: 'The Teacher: Inspiring Tomorrow\'s Engineers',
      tagline: 'Demystifying AI, logic, and coding for enthusiastic school students through the Shivkunj AI Initiative ("Dnyanaacha Prakaash Sarvansaathi").',
      story: 'Between my university exams with zero funding, I walked into 100-year-old Mahatma Jyotirao Phule High School in Pune to teach 100 school students AI—from Transformer foundations to generating a 10-second movie on Chhatrapati Shivaji Maharaj, culminating in our Independence Day graduation where 100+ students received certificates as the AI creators of tomorrow! 🎓🇮🇳',
      fact: '3-Day Workshop Series: 100+ students reached, zero funding, animated Shivaji Maharaj historical movie, and 100+ certificates conferred! 🚩🎓',
      theme: {
        accent: '#a855f7',
        accentRgb: '168, 85, 247',
        accentHover: '#9333ea',
        accentLight: '#d8b4fe',
        accentContrast: '#0d0218'
      }
    },
    dealer: {
      badge: 'Sadik Motors, Junnar',
      title: 'The Dealer: Grassroots Mechanical Grit',
      tagline: 'Grounded in the engines, tradecraft, and customer trust of Sadik Motors in Junnar—where mechanical discipline meets digital innovation.',
      story: 'Sadik Motors in Junnar is where my understanding of real-world mechanics and human relations began. Growing up around engine diagnostics, customer negotiations, and fleet logistics taught me accountability long before I touched a terminal. That gritty operational discipline directly shapes how I build software today: no fluff, clean mechanics, and total dependability under load.',
      fact: 'Learned customer psychology and operational discipline at Sadik Motors in Junnar before writing code.',
      theme: {
        accent: '#f97316',
        accentRgb: '249, 115, 22',
        accentHover: '#ea580c',
        accentLight: '#fdba74',
        accentContrast: '#0a0401'
      }
    }
  };

  const DEFAULT_THEME = {
    accent: '#bafc36',
    accentRgb: '186, 252, 54',
    accentHover: '#a5f216',
    accentLight: '#dcff7a',
    accentContrast: '#100c30',
    tagline: 'Architecting cost-efficient AI agents, production AWS cloud backends, and edge computer vision systems to solve real-world complexities.'
  };

  // Swaps CSS custom properties on :root (Requirement 3a)
  const applyThemeColors = (theme) => {
    const root = document.documentElement;
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-rgb', theme.accentRgb);
    root.style.setProperty('--accent-hover', theme.accentHover);
    root.style.setProperty('--accent-light', theme.accentLight);
    root.style.setProperty('--accent-contrast', theme.accentContrast);
    root.style.setProperty('--accent-glow', `rgba(${theme.accentRgb}, 0.25)`);
    root.style.setProperty('--accent-glow-strong', `rgba(${theme.accentRgb}, 0.5)`);
    root.style.setProperty('--accent-subtle', `rgba(${theme.accentRgb}, 0.1)`);
    root.style.setProperty('--accent-subtle-border', `rgba(${theme.accentRgb}, 0.3)`);
  };

  // Smooth Tagline Transition (Requirement 3b)
  const updateTagline = (newText) => {
    if (!heroTagline) return;
    if (heroTagline.textContent.trim() === newText.trim()) return;

    heroTagline.classList.add('is-changing');
    setTimeout(() => {
      heroTagline.textContent = newText;
      heroTagline.classList.remove('is-changing');
    }, 220);
  };

  // Lightweight Canvas Confetti Burst (< 2s, zero dependencies - Requirement 4)
  const triggerConfettiBurst = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ['#bafc36', '#c0b6ff', '#bef779', '#100c30', '#cdebb8', '#ffffff'];
    const particleCount = 65;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width * 0.25 + Math.random() * width * 0.5,
        y: height * 0.25 + Math.random() * height * 0.2,
        vx: (Math.random() - 0.5) * 11,
        vy: (Math.random() - 0.7) * 13,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 9
      });
    }

    const startTime = performance.now();
    const duration = 1800; // Under 2 seconds

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        canvas.remove();
        return;
      }

      ctx.clearRect(0, 0, width, height);
      const alpha = progress > 0.7 ? (1 - progress) / 0.3 : 1;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.32; // Gravity
        p.vx *= 0.98; // Air drag
        p.rotation += p.vRotation;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  // Easter Egg Tracker: Checks if all 4 hats have been tried
  let triedHats = new Set();
  const savedTried = safeStorage.get('saad_tried_hats');
  if (savedTried) {
    try {
      JSON.parse(savedTried).forEach((h) => triedHats.add(h));
    } catch (e) {}
  }

  const checkEasterEgg = () => {
    if (triedHats.size === 4 && hatEasterEggBanner) {
      const easterEggSeen = safeStorage.get('saad_easter_egg_seen');
      if (!easterEggSeen) {
        hatEasterEggBanner.removeAttribute('hidden');
        triggerConfettiBurst();
        safeStorage.set('saad_easter_egg_seen', 'true');
      }
    }
  };

  // Stop Hint Pulse on First Interaction (Requirement 1)
  const stopHintPulse = () => {
    if (hatHintPill && hatHintPill.classList.contains('pulsing')) {
      hatHintPill.classList.remove('pulsing');
      safeStorage.set('saad_hat_pulse_stopped', 'true');
    }
  };

  if (safeStorage.get('saad_hat_pulse_stopped') === 'true' && hatHintPill) {
    hatHintPill.classList.remove('pulsing');
  }

  if (hatHintPill) {
    hatHintPill.addEventListener('click', () => {
      stopHintPulse();
      // Cycle or highlight the first hat if none selected
      const firstHatBtn = document.getElementById('hatBtn-builder');
      if (firstHatBtn) {
        firstHatBtn.focus();
        firstHatBtn.click();
      }
    });
  }

  // Close Story Card Function
  const closeStoryCard = () => {
    if (hatStoryCard) {
      hatStoryCard.setAttribute('hidden', '');
    }
  };

  if (storyCloseBtn) {
    storyCloseBtn.addEventListener('click', closeStoryCard);
  }

  if (easterEggDismissBtn && hatEasterEggBanner) {
    easterEggDismissBtn.addEventListener('click', () => {
      hatEasterEggBanner.setAttribute('hidden', '');
    });
  }

  // Reset to Default Theme (Requirement 5)
  const resetThemeToDefault = () => {
    applyThemeColors(DEFAULT_THEME);
    updateTagline(DEFAULT_THEME.tagline);

    hatButtons.forEach((btn) => {
      btn.setAttribute('aria-pressed', 'false');
    });

    closeStoryCard();

    if (hatResetBtn) {
      hatResetBtn.setAttribute('hidden', '');
    }

    safeStorage.remove('saad_active_hat');
  };

  if (hatResetBtn) {
    hatResetBtn.addEventListener('click', resetThemeToDefault);
  }

  // Apply Hat Selection
  const selectHat = (hatKey, recordTried = true) => {
    const data = HAT_DATA[hatKey];
    if (!data) return;

    stopHintPulse();

    // 1. Swap CSS Custom Properties on :root
    applyThemeColors(data.theme);

    // 2. Change Hero Tagline
    updateTagline(data.tagline);

    // 3. Update & Open Story Card
    if (hatStoryCard && storyBadge && storyTitle && storyBody && storyFact) {
      storyBadge.textContent = data.badge;
      storyTitle.textContent = data.title;
      storyBody.textContent = data.story;
      storyFact.textContent = data.fact;
      hatStoryCard.removeAttribute('hidden');
    }

    // 4. Update Button ARIA States
    hatButtons.forEach((btn) => {
      const isSelected = btn.dataset.hat === hatKey;
      btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
    });

    // 5. Show Reset Button
    if (hatResetBtn) {
      hatResetBtn.removeAttribute('hidden');
    }

    // 6. Persistence & Easter Egg Tracking
    safeStorage.set('saad_active_hat', hatKey);

    if (recordTried) {
      triedHats.add(hatKey);
      safeStorage.set('saad_tried_hats', JSON.stringify(Array.from(triedHats)));
      checkEasterEgg();
    }
  };

  // Attach Hat Button Listeners (Requirement 6)
  hatButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const hatKey = btn.dataset.hat;
      const isAlreadyActive = btn.getAttribute('aria-pressed') === 'true';

      if (isAlreadyActive && hatStoryCard && !hatStoryCard.hasAttribute('hidden')) {
        // Toggle close story card if already active
        closeStoryCard();
      } else {
        selectHat(hatKey, true);
      }
    });
  });

  // Restore Last Hat from LocalStorage (Requirement 7)
  const lastSavedHat = safeStorage.get('saad_active_hat');
  if (lastSavedHat && HAT_DATA[lastSavedHat]) {
    selectHat(lastSavedHat, false);
  }

  // Keyboard accessibility: Close story card on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (terminalPanel && !terminalPanel.hasAttribute('hidden')) {
        closeTerminal();
        return;
      }
      if (hatStoryCard && !hatStoryCard.hasAttribute('hidden')) {
        closeStoryCard();
        const activeHatBtn = document.querySelector('.hat-btn[aria-pressed="true"]');
        if (activeHatBtn) activeHatBtn.focus();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 9. Saad Interactive Terminal Engine
  // Features: Command parsing, monospace typing, history, tab completion,
  //           theme re-skinning, quick chips & 'sudo hire-saad' action.
  // --------------------------------------------------------------------------
  const terminalLauncher = document.getElementById('terminalLauncher');
  const terminalPanel = document.getElementById('terminalPanel');
  const terminalCloseBtn = document.getElementById('terminalCloseBtn');
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const termChips = document.querySelectorAll('.term-chip');

  // Command History Buffer
  const commandHistory = [];
  let historyIndex = -1;

  // Supported Command Autocomplete Dictionary
  const AUTOCOMPLETE_COMMANDS = [
    'help',
    'about',
    'skills',
    'projects',
    'roles',
    'contact',
    'hats',
    'shivkunj',
    'theme neon',
    'theme pastel',
    'theme dark',
    'theme builder',
    'clear',
    'sudo hire-saad'
  ];

  // Additional Terminal Theme Presets (Requirement: theme neon|pastel|dark)
  const TERMINAL_THEMES = {
    neon: {
      accent: '#00ff88',
      accentRgb: '0, 255, 136',
      accentHover: '#00cc6a',
      accentLight: '#6ee7b7',
      accentContrast: '#021a0e',
      label: 'Matrix Cyber Neon'
    },
    pastel: {
      accent: '#f472b6',
      accentRgb: '244, 114, 182',
      accentHover: '#db2777',
      accentLight: '#fbcfe8',
      accentContrast: '#1a0410',
      label: 'Soft Warm Pastel Rose'
    },
    dark: {
      accent: '#bafc36',
      accentRgb: '186, 252, 54',
      accentHover: '#a5f216',
      accentLight: '#dcff7a',
      accentContrast: '#100c30',
      label: 'AWS Student Builder Challenge'
    },
    builder: {
      accent: '#bafc36',
      accentRgb: '186, 252, 54',
      accentHover: '#a5f216',
      accentLight: '#dcff7a',
      accentContrast: '#100c30',
      label: 'AWS Student Builder Challenge'
    }
  };

  // Open / Close Terminal Controllers
  const openTerminal = () => {
    if (!terminalPanel) return;
    terminalPanel.removeAttribute('hidden');
    if (terminalLauncher) {
      terminalLauncher.setAttribute('aria-expanded', 'true');
    }

    // Initial welcome banner if buffer is empty
    if (terminalOutput && terminalOutput.children.length === 0) {
      const intro = document.createElement('div');
      intro.className = 'term-entry';
      intro.innerHTML = `
        <div class="term-response-text" style="color: var(--accent-light);">
┌─────────────────────────────────────────────────────────────┐
│  Saad Terminal (v1.0.0-release) - Pune / Junnar Ecosystem   │
│  Type 'help' for commands, or tap the quick chips below.    │
└─────────────────────────────────────────────────────────────┘
        </div>`;
      terminalOutput.appendChild(intro);
    }

    if (terminalInput) {
      terminalInput.focus();
    }
  };

  const closeTerminal = () => {
    if (!terminalPanel) return;
    terminalPanel.setAttribute('hidden', '');
    if (terminalLauncher) {
      terminalLauncher.setAttribute('aria-expanded', 'false');
      terminalLauncher.focus();
    }
  };

  const toggleTerminal = () => {
    if (!terminalPanel) return;
    const isOpen = !terminalPanel.hasAttribute('hidden');
    if (isOpen) {
      closeTerminal();
    } else {
      openTerminal();
    }
  };

  if (terminalLauncher) {
    terminalLauncher.addEventListener('click', toggleTerminal);
  }

  if (terminalCloseBtn) {
    terminalCloseBtn.addEventListener('click', closeTerminal);
  }

  // Monospace Typed-Out Response Printer (with fast streaming for responsiveness)
  const printTerminalResponse = (commandText, responseString, callback) => {
    if (!terminalOutput) return;

    const entry = document.createElement('div');
    entry.className = 'term-entry';

    // 1. User prompt line
    const userLine = document.createElement('div');
    userLine.className = 'term-user-cmd';
    userLine.textContent = `guest@saad:~$ ${commandText}`;
    entry.appendChild(userLine);

    // 2. Output text container
    const respContainer = document.createElement('div');
    respContainer.className = 'term-response-text';
    entry.appendChild(respContainer);
    terminalOutput.appendChild(entry);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    // Fast typewriter line-by-line streaming
    const lines = responseString.split('\n');
    let lineIdx = 0;

    const streamLine = () => {
      if (lineIdx < lines.length) {
        const lineDiv = document.createElement('div');
        lineDiv.textContent = lines[lineIdx];
        respContainer.appendChild(lineDiv);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        lineIdx++;
        setTimeout(streamLine, 14); // Snappy 14ms per line
      } else {
        if (callback) callback();
      }
    };

    streamLine();
  };

  // Command Execution Engine (Uses Real Portfolio Content)
  const executeTerminalCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    // Save to command history
    commandHistory.push(trimmed);
    historyIndex = -1;

    const lower = trimmed.toLowerCase();
    const parts = lower.split(/\s+/);
    const mainCmd = parts[0];

    // 1. Command: help
    if (mainCmd === 'help') {
      const helpText = 
`SAAD TERMINAL COMMAND MANUAL:
  about            - Saad's journey from Junnar dealership to AI & AWS leader
  skills           - Categorized competencies (AI/ML, Data, Cloud, Web, Leadership)
  projects         - 6 featured production projects & tech stacks
  roles            - Timeline of appointments, hackathons & community roles
  contact          - Direct contact channels, email & social profiles
  hats             - The 4 roles Saad balances (Builder, Founder, Teacher, Dealer)
  shivkunj         - Shivkunj AI Initiative workshop log & LinkedIn videos (Day 1 & Day 2)
  theme <name>     - Re-skin site colors (neon | pastel | dark)
  clear            - Wipe terminal screen buffer
  sudo hire-saad   - [RESTRICTED] Executive talent acquisition protocol`;
      printTerminalResponse(trimmed, helpText);
      return;
    }

    // 2. Command: about
    if (mainCmd === 'about') {
      const aboutText = 
`M. SAAD M. SADIK SHAIKH (SAAD)
Third-year B.Tech in Artificial Intelligence & Data Science
College: APCOE&R Pune (Savitribai Phule Pune University, Class of 2028)

• Roots: Raised around mechanical diagnostics, engine overhauls, and fleet logistics
  at our family vehicle dealership in Junnar, Maharashtra. That early exposure to
  interconnected mechanical assemblies sparked a relentless passion for computing,
  distributed cloud architectures, and machine intelligence.
• Current Focus: Developing production AI systems, cost-governed multi-agent guardrails,
  and computer vision applications.
• Leadership: AWS Student Builder Campus Leader 2026, AWS Student Builder Group Co-Organizer,
  GeeksforGeeks Campus Mantri, Microsoft Learn & Google Student Ambassador.`;
      printTerminalResponse(trimmed, aboutText);
      return;
    }

    // 3. Command: skills
    if (mainCmd === 'skills') {
      const skillsText = 
`TECHNICAL SUPERPOWERS & COMPETENCIES:
[AI and ML]     PyTorch, TensorFlow, OpenCV, Hugging Face, LLM Agent Architectures,
                Prompt Engineering, Scikit-Learn, Computer Vision, Model Optimization
[Data]          Python, Pandas, NumPy, SQL, Feature Engineering, EDA, Matplotlib,
                Seaborn, Data Preprocessing, Vector Embeddings
[Cloud (AWS)]   Amazon EC2, Amazon S3, AWS Lambda, AWS IAM, Amazon SageMaker,
                Amazon CloudWatch, Boto3 SDK, AWS CLI, Cloud Cost Optimization
[Web]           HTML5 Semantic Web, Modern CSS3, Vanilla JavaScript ES6+, RESTful APIs,
                FastAPI, Flask, Responsive Layouts, WCAG Accessibility
[Leadership]    AWS SBCL 2026 Leadership, Student Builder Group Co-Organizer,
                GeeksforGeeks Campus Mantri, Microsoft & Google Ambassador, Workshops`;
      printTerminalResponse(trimmed, skillsText);
      return;
    }

    // 4. Command: projects
    if (mainCmd === 'projects') {
      const projText = 
`FEATURED OPEN-SOURCE & HACKATHON PROJECTS:
[01] Lost & Found Portal (LFP)
     Campus asset recovery platform engineered during APCOE&R Pune Hackathon.
     Tech: JavaScript, HTML5, CSS3, LocalStorage, Campus Web
     GitHub: https://github.com/saad-aids/LFP-Lost-and-Found-Portal

[02] LangGraph Conditional Hiring Workflow
     Conditional candidate evaluation & interview routing pipeline.
     Tech: Python, LangGraph, LangChain, Streamlit, LLM Agents
     GitHub: https://github.com/saad-aids/LangGraph-Hiring-Workflow

[03] Cyber-Suraksha: Fraud Recovery Shield
     Incident responder & vernacular scam detection shield for Maharashtra.
     Tech: Python, NLP, Threat Intel, Streamlit, Vernacular AI
     GitHub: https://github.com/saad-aids/cyber-suraksha

[04] Student Sleep Detector (Hindi Alert)
     Real-time drowsiness detection with automated Hindi audio alerts.
     Tech: Python, OpenCV, EAR Landmarks, Edge Vision, Audio Alerts
     GitHub: https://github.com/saad-aids/sleep_detector

[05] Atmosify: Real-Time Weather Application
     Fast, responsive planetary meteorological forecast web application.
     Tech: JavaScript ES6+, OpenWeather API, HTML5, CSS3 Grid, Fetch API
     GitHub: https://github.com/saad-aids/Weather-app

[06] Offroad Scene Segmentation (VIT Kondhwa)
     Deep learning semantic offroad terrain segmentation for VIT Pune Hackathon.
     Tech: Python, YOLO, Computer Vision, Semantic Segmentation, PyTorch
     GitHub: https://github.com/saad-aids/YOLO_HACKATHON-VIT-KONDHWA`;
      printTerminalResponse(trimmed, projText);
      return;
    }

    // 5. Command: roles
    if (mainCmd === 'roles' || mainCmd === 'achievements') {
      const rolesText = 
`ACHIEVEMENTS & TIMELINE:
• 2026        | AWS Student Builder Campus Leader (SBCL) 2026 - Amazon Web Services
                Spearheading campus cloud literacy, labs, and AWS certification paths.
• 2026        | AWS Student Builder Group (SBGL) Co-Organizer - AWS Community Pune
                Co-leading regional cloud meetups, architecture clinics, and peer labs.
• 2026        | GSSoC 2026 Contributor - GirlScript Summer of Code
                Delivering open-source optimizations, algorithms, and documentation.
• 2025 – 2026 | AWS Future Builders Connect Pune Volunteer
                Facilitated logistics and speaker hosting for 500+ attendees.
• 2025 – 2026 | Smart India Hackathon Participant
                Engineered modular AMR robotics navigation under national competition.`;
      printTerminalResponse(trimmed, rolesText);
      return;
    }

    // 6. Command: contact
    if (mainCmd === 'contact') {
      const contactText = 
`CONNECT WITH SAAD:
• Email:        shaikhmsaadmsadik@gmail.com
• LinkedIn:     https://linkedin.com/in/m-saad-m-sadik-shaikh-4263b0371
• Instagram:    @ai_engineer_saad (https://instagram.com/ai_engineer_saad)
• AWS Builder:  @saad07 (https://community.aws/u/saad07)
• Location:     Junnar & Pune, Maharashtra, India`;
      printTerminalResponse(trimmed, contactText);
      return;
    }

    // 7. Command: hats
    if (mainCmd === 'hats') {
      const hatsText = 
`THE 4 HATS OF SAAD SHAIKH:
[Builder]  AWS & AI Projects
           Engineering scalable AWS Lambda backends, Boto3 workflows, and token guardrails.
[Founder]  AI Saad Services
           Bootstrapping practical AI automation for grassroots small businesses in Maharashtra.
[Teacher]  Shivkunj AI Initiative ("Dnyanaacha Prakaash Sarvansaathi")
           Demystifying AI for school kids; from Transformers to generating Chhatrapati Shivaji Maharaj movies.
[Dealer]   Sadik Motors
           Our family vehicle dealership in Junnar; the source of my real-world mechanical
           grit, customer trust, and operational discipline.`;
      printTerminalResponse(trimmed, hatsText);
      return;
    }

    // 7b. Command: shivkunj
    if (mainCmd === 'shivkunj' || mainCmd === 'education') {
      const shivkunjText = 
`SHIVKUNJ AI INITIATIVE ("Dnyanaacha Prakaash Sarvansaathi"):
Grassroots AI Education at 100-yr old Mahatma Jyotirao Phule High School, Pune

[DAY 01] The Courage to Start (100 Students Reached)
  • Between exam papers with zero funding, walked into a 100-year-old school.
  • Students whispered: "AI ne amchi shabd aikla?" ("Did AI listen to my word?").
  • LinkedIn Video: https://lnkd.in/p/drKgzgH9

[DAY 02] Transforming Young Minds (Classes 5th to 10th)
  • Explored Transformers & "Attention Is All You Need" (2017).
  • Students generated cartoon comics, visual stories, and a 10-second
    AI movie on Chhatrapati Shivaji Maharaj 🚩!
  • LinkedIn Video: https://lnkd.in/p/dmjEpUaX

[DAY 03] Grand Graduation & 100+ Certificates 🎓🇮🇳
  • Celebrated Independence Day awarding certificates to 100+ young AI creators!
  • Students demonstrated practical AI tools, visual storytelling & confidence.
  • LinkedIn Video: https://lnkd.in/p/dAJ2k7zB

Scrolling to Shivkunj Showcase...`;
      printTerminalResponse(trimmed, shivkunjText, () => {
        setTimeout(() => {
          closeTerminal();
          const target = document.getElementById('shivkunj-initiative');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 750);
      });
      return;
    }

    // 8. Command: theme neon|pastel|dark
    if (mainCmd === 'theme') {
      const themeArg = parts[1];
      if (themeArg && TERMINAL_THEMES[themeArg]) {
        const selected = TERMINAL_THEMES[themeArg];
        applyThemeColors(selected);
        safeStorage.set('saad_portfolio_theme_preset', themeArg);
        const themeMsg = `[SUCCESS] Website theme swapped to '${themeArg}' (${selected.label}). All CSS custom properties updated.`;
        printTerminalResponse(trimmed, themeMsg);
      } else {
        const themeUsage = 
`Usage: theme <neon | pastel | dark | builder>
Available presets:
  • dark / builder - AWS Student Builder Challenge (#bafc36)
  • neon           - Matrix Cyber Neon Green (#00ff88)
  • pastel         - Soft Warm Pastel Rose (#f472b6)`;
        printTerminalResponse(trimmed, themeUsage);
      }
      return;
    }

    // 9. Command: clear
    if (mainCmd === 'clear') {
      if (terminalOutput) {
        terminalOutput.innerHTML = '';
      }
      return;
    }

    // 10. Hidden Command: sudo hire-saad
    if (lower === 'sudo hire-saad' || lower === 'hire-saad') {
      const hireMsg = 
`[AUTH GRANTED: ROOT CREDENTIALS CONFIRMED]
Executing candidate evaluation protocol on M. Saad M. Sadik Shaikh...

Analyzing Profile:
✓ Technical Architecture : Exceptional (Cloud, AI Agents, OpenCV, Full-Stack)
✓ Operational Discipline : Dealership-forged grit, zero fluff, high reliability
✓ Community Leadership   : Proven leader (AWS SBCL '26, SBGL Pune, GfG Campus Mantri)
✓ Problem Solving        : National finalist engineering standard (SIH Robotics)
✓ Cultural Compatibility : 100% team player & dedicated mentor

VERDICT: UNANIMOUS HIRE! 🎉
Offer status: APPROVED WITH HONORS.
Scrolling down to Contact section to initiate communication...`;

      printTerminalResponse(trimmed, hireMsg, () => {
        setTimeout(() => {
          closeTerminal();
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            const emailCode = document.getElementById('emailCode');
            if (emailCode) {
              emailCode.style.outline = '2px solid var(--accent)';
              setTimeout(() => { emailCode.style.outline = ''; }, 3000);
            }
          }
        }, 600);
      });
      return;
    }

    // 11. Unknown Command: Friendly Suggestion
    const unknownMsg = 
`Command not found: '${trimmed}'.
Did you mean 'help'? Type 'help' to view the manual or click any suggestion chip below.`;
    printTerminalResponse(trimmed, unknownMsg);
  };

  // Form Submission Listener
  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cmd = terminalInput.value;
      terminalInput.value = '';
      executeTerminalCommand(cmd);
    });

    // Keyboard History (ArrowUp & ArrowDown) + Tab Completion
    terminalInput.addEventListener('keydown', (e) => {
      // 1. Tab Autocompletion
      if (e.key === 'Tab') {
        e.preventDefault();
        const currentVal = terminalInput.value.trim().toLowerCase();
        if (!currentVal) return;

        const matches = AUTOCOMPLETE_COMMANDS.filter((cmd) => cmd.startsWith(currentVal));

        if (matches.length === 1) {
          terminalInput.value = matches[0];
        } else if (matches.length > 1) {
          const matchNotice = `Possible completions:\n  ${matches.join('   ')}`;
          printTerminalResponse(currentVal, matchNotice);
        }
        return;
      }

      // 2. Up Arrow: Move to previous history
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        if (historyIndex === -1) {
          historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
          historyIndex--;
        }
        terminalInput.value = commandHistory[historyIndex] || '';
        return;
      }

      // 3. Down Arrow: Move to newer history
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;

        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex] || '';
        } else {
          historyIndex = -1;
          terminalInput.value = '';
        }
      }
    });
  }

  // Suggestion Chips Click Handlers
  termChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.dataset.cmd;
      if (!cmd) return;
      if (terminalInput) {
        terminalInput.value = cmd;
      }
      executeTerminalCommand(cmd);
      if (terminalInput) {
        terminalInput.focus();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 8b. Shivkunj AI Initiative Showcase Controller (Day Tabs & Interactive Lock)
  // --------------------------------------------------------------------------
  const tabDay1 = document.getElementById('tabDay1');
  const tabDay2 = document.getElementById('tabDay2');
  const tabDay3 = document.getElementById('tabDay3');
  const panelDay1 = document.getElementById('panelDay1');
  const panelDay2 = document.getElementById('panelDay2');
  const panelDay3 = document.getElementById('panelDay3');
  const tab2LockIcon = document.getElementById('tab2LockIcon');
  const tab3LockIcon = document.getElementById('tab3LockIcon');
  const day2LockGate = document.getElementById('day2LockGate');
  const day2FullLayout = document.getElementById('day2FullLayout');
  const day3LockGate = document.getElementById('day3LockGate');
  const day3FullLayout = document.getElementById('day3FullLayout');
  const btnUnlockDay2 = document.getElementById('btnUnlockDay2');
  const btnRelockDay2 = document.getElementById('btnRelockDay2');
  const btnUnlockDay3 = document.getElementById('btnUnlockDay3');
  const btnRelockDay3 = document.getElementById('btnRelockDay3');

  const switchShivkunjTab = (dayNum) => {
    const tabs = [tabDay1, tabDay2, tabDay3];
    const panels = [panelDay1, panelDay2, panelDay3];

    tabs.forEach((tab, idx) => {
      if (!tab) return;
      const isActive = (idx + 1) === dayNum;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel, idx) => {
      if (!panel) return;
      const isActive = (idx + 1) === dayNum;
      panel.classList.toggle('active', isActive);
    });
  };

  if (tabDay1) {
    tabDay1.addEventListener('click', () => switchShivkunjTab(1));
  }
  if (tabDay2) {
    tabDay2.addEventListener('click', () => switchShivkunjTab(2));
  }
  if (tabDay3) {
    tabDay3.addEventListener('click', () => switchShivkunjTab(3));
  }

  // Day 02 Lock / Unlock Mechanism
  const unlockDay2 = () => {
    if (day2LockGate) day2LockGate.classList.add('is-hidden');
    if (day2FullLayout) {
      day2FullLayout.classList.remove('is-hidden');
      day2FullLayout.removeAttribute('hidden');
    }
    if (tab2LockIcon) {
      tab2LockIcon.textContent = '🔓';
      tab2LockIcon.className = 'lock-indicator unlocked';
      tab2LockIcon.title = 'Milestone Unlocked';
    }
    safeStorage.set('shivkunj_day2_unlocked', 'true');
    triggerConfettiBurst();
  };

  const relockDay2 = () => {
    if (day2LockGate) day2LockGate.classList.remove('is-hidden');
    if (day2FullLayout) {
      day2FullLayout.classList.add('is-hidden');
    }
    if (tab2LockIcon) {
      tab2LockIcon.textContent = '🔒';
      tab2LockIcon.className = 'lock-indicator locked';
      tab2LockIcon.title = 'Milestone Locked';
    }
    safeStorage.set('shivkunj_day2_unlocked', 'false');
  };

  if (btnUnlockDay2) {
    btnUnlockDay2.addEventListener('click', unlockDay2);
  }
  if (btnRelockDay2) {
    btnRelockDay2.addEventListener('click', relockDay2);
  }

  // Restore Day 02 Unlock State
  if (safeStorage.get('shivkunj_day2_unlocked') === 'true') {
    if (day2LockGate) day2LockGate.classList.add('is-hidden');
    if (day2FullLayout) {
      day2FullLayout.classList.remove('is-hidden');
      day2FullLayout.removeAttribute('hidden');
    }
    if (tab2LockIcon) {
      tab2LockIcon.textContent = '🔓';
      tab2LockIcon.className = 'lock-indicator unlocked';
      tab2LockIcon.title = 'Milestone Unlocked';
    }
  }

  // Day 03 Lock / Unlock Mechanism
  const unlockDay3 = () => {
    if (day3LockGate) day3LockGate.classList.add('is-hidden');
    if (day3FullLayout) {
      day3FullLayout.classList.remove('is-hidden');
      day3FullLayout.removeAttribute('hidden');
    }
    if (tab3LockIcon) {
      tab3LockIcon.textContent = '🔓';
      tab3LockIcon.className = 'lock-indicator unlocked';
      tab3LockIcon.title = 'Milestone Unlocked';
    }
    safeStorage.set('shivkunj_day3_unlocked', 'true');
    triggerConfettiBurst();
  };

  const relockDay3 = () => {
    if (day3LockGate) day3LockGate.classList.remove('is-hidden');
    if (day3FullLayout) {
      day3FullLayout.classList.add('is-hidden');
    }
    if (tab3LockIcon) {
      tab3LockIcon.textContent = '🔒';
      tab3LockIcon.className = 'lock-indicator locked';
      tab3LockIcon.title = 'Milestone Locked';
    }
    safeStorage.set('shivkunj_day3_unlocked', 'false');
  };

  if (btnUnlockDay3) {
    btnUnlockDay3.addEventListener('click', unlockDay3);
  }
  if (btnRelockDay3) {
    btnRelockDay3.addEventListener('click', relockDay3);
  }

  // Restore Day 03 Unlock State
  if (safeStorage.get('shivkunj_day3_unlocked') === 'true') {
    if (day3LockGate) day3LockGate.classList.add('is-hidden');
    if (day3FullLayout) {
      day3FullLayout.classList.remove('is-hidden');
      day3FullLayout.removeAttribute('hidden');
    }
    if (tab3LockIcon) {
      tab3LockIcon.textContent = '🔓';
      tab3LockIcon.className = 'lock-indicator unlocked';
      tab3LockIcon.title = 'Milestone Unlocked';
    }
  }

  // Ensure default AWS Challenge theme version is active (clears legacy cached presets)
  const THEME_STORAGE_VERSION = 'aws-challenge-v3.2';
  if (safeStorage.get('saad_portfolio_theme_version') !== THEME_STORAGE_VERSION) {
    safeStorage.remove('saad_portfolio_theme_preset');
    safeStorage.remove('saad_active_hat');
    safeStorage.set('saad_portfolio_theme_version', THEME_STORAGE_VERSION);
    applyThemeColors(DEFAULT_THEME);
  } else {
    // Restore Saved Terminal Theme Preset if user explicitly selected one
    const savedThemePreset = safeStorage.get('saad_portfolio_theme_preset');
    if (savedThemePreset && TERMINAL_THEMES[savedThemePreset]) {
      applyThemeColors(TERMINAL_THEMES[savedThemePreset]);
    }
  }

  // --------------------------------------------------------------------------
  // 9. Console Welcome Signature
  // --------------------------------------------------------------------------
  console.log(
    '%c Saad Shaikh %c Portfolio Initialized | AWS Student Builder Challenge Theme Ready ',
    'background: #bafc36; color: #100c30; font-weight: bold; border-radius: 3px 0 0 3px; padding: 3px 6px; font-family: monospace;',
    'background: #100c30; color: #bafc36; border-radius: 0 3px 3px 0; padding: 3px 6px; font-family: monospace;'
  );


  // --------------------------------------------------------------------------
  // Inline Theater View Controller (Plays directly on page, never leaves portfolio)
  // --------------------------------------------------------------------------
  const theaterModal = document.getElementById('theaterModal');
  const theaterModalTitle = document.getElementById('theaterModalTitle');
  const theaterIframe = document.getElementById('theaterIframe');
  const theaterCloseBtn = document.getElementById('theaterCloseBtn');
  const theaterExpandBtns = document.querySelectorAll('.theater-expand-btn');

  const openTheaterModal = (videoId, title) => {
    if (!theaterModal || !theaterIframe) return;
    if (theaterModalTitle) theaterModalTitle.textContent = title || 'Live Video Playback';
    theaterIframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
    theaterModal.removeAttribute('hidden');
    if (theaterCloseBtn) theaterCloseBtn.focus();
  };

  const closeTheaterModal = () => {
    if (!theaterModal || !theaterIframe) return;
    theaterModal.setAttribute('hidden', '');
    theaterIframe.src = ''; // Stops playback immediately
  };

  theaterExpandBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const vid = btn.dataset.videoId;
      const title = btn.dataset.title;
      if (vid) openTheaterModal(vid, title);
    });
  });

  if (theaterCloseBtn) {
    theaterCloseBtn.addEventListener('click', closeTheaterModal);
  }

  if (theaterModal) {
    theaterModal.addEventListener('click', (e) => {
      if (e.target === theaterModal) closeTheaterModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && theaterModal && !theaterModal.hasAttribute('hidden')) {
      closeTheaterModal();
    }
  });

});
