/**
 * Portfolio JavaScript - Interactive UI, Smooth Scrollspy, Theme Switcher & Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Management (Dark / Light Mode)
  initTheme();

  // 2. Navigation & Mobile Drawer
  initNavigation();

  // 3. Scrollspy (Active Section Highlight)
  initScrollspy();

  // 4. Copy-to-Clipboard Convenience
  initClipboard();

  // 5. Contact Form Validation & Toast Feedback
  initContactForm();

  // 6. Dynamic Year
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

/* ==========================================================================
   1. Theme Management
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

  // Retrieve saved theme or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'dark'); // default dark for tech aesthetic

  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.className = 'fa-solid fa-moon';
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        themeIcon.className = 'fa-solid fa-sun';
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
        themeToggleBtn.setAttribute('aria-label', 'Switch to Light Mode');
      }
    }
  }
}

/* ==========================================================================
   2. Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');

  // Sticky header background transition on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile drawer toggle
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      hamburgerBtn.innerHTML = isOpen 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
      hamburgerBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
          hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

/* ==========================================================================
   3. Scrollspy (Active Section Highlight)
   ========================================================================== */
function initScrollspy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   4. Copy-to-Clipboard Convenience
   ========================================================================== */
function initClipboard() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', () => {
      const textToCopy = button.getAttribute('data-copy') || '';
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = button.innerHTML;
        button.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        button.style.borderColor = 'var(--accent-tertiary)';
        button.style.color = 'var(--accent-tertiary)';
        showToast(`Copied "${textToCopy}" to clipboard!`, 'success');

        setTimeout(() => {
          button.innerHTML = originalHtml;
          button.style.borderColor = '';
          button.style.color = '';
        }, 2200);
      }).catch(() => {
        showToast('Unable to copy to clipboard', 'error');
      });
    });
  });
}

/* ==========================================================================
   5. Contact Form Validation & Toast Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('senderName');
    const emailInput = document.getElementById('senderEmail');
    const subjectInput = document.getElementById('senderSubject');
    const messageInput = document.getElementById('senderMessage');
    const submitBtn = form.querySelector('button[type="submit"]');

    // Simple validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showToast('Please provide a valid email address.', 'error');
      emailInput.focus();
      return;
    }

    // Simulate sending with loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending message...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      showToast('Thank you! Your message has been sent successfully.', 'success');
    }, 1200);
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  
  let iconHtml = '<i class="fa-solid fa-circle-info" style="color: var(--accent-primary)"></i>';
  if (type === 'success') {
    iconHtml = '<i class="fa-solid fa-circle-check" style="color: var(--accent-tertiary)"></i>';
  } else if (type === 'error') {
    iconHtml = '<i class="fa-solid fa-circle-exclamation" style="color: #ef4444"></i>';
  }

  toast.innerHTML = `
    ${iconHtml}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   Modal Dialog Handling (Reusable)
   ========================================================================== */
window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

// Global click outside modal to close
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});
