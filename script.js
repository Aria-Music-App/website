/* ============================================
   Aria Landing Page — script.js
   Dual email forms + smooth scroll + scroll reveals
   ============================================ */

(function () {
  'use strict';

  // --- Email Forms (hero + bottom CTA) ---
  function initForm(formId, errorId, successId) {
    var form = document.getElementById(formId);
    var errorEl = document.getElementById(errorId);
    var successEl = document.getElementById(successId);

    if (!form) return;

    var emailInput = form.querySelector('input[type="email"]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = emailInput.value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorEl.textContent = 'Please enter a valid email address.';
        errorEl.hidden = false;
        return;
      }

      var submitBtn = form.querySelector('.btn-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = '...';

      var formData = new FormData();
      formData.append('email', email);

      fetch('https://buttondown.com/api/emails/embed-subscribe/AriaApp', {
        method: 'POST',
        body: formData
      })
        .then(function (res) {
          if (res.ok || res.status === 201 || res.status === 200) {
            form.hidden = true;
            successEl.hidden = false;
          } else {
            errorEl.textContent = 'Something went wrong. Please try again.';
            errorEl.hidden = false;
            submitBtn.disabled = false;
            submitBtn.textContent = 'Notify Me';
          }
        })
        .catch(function () {
          errorEl.textContent = 'Could not connect. Please try again.';
          errorEl.hidden = false;
          submitBtn.disabled = false;
          submitBtn.textContent = 'Notify Me';
        });
    });

    // Clear error on input
    if (emailInput) {
      emailInput.addEventListener('input', function () {
        errorEl.hidden = true;
      });
    }
  }

  // Initialize both forms
  initForm('hero-form', 'hero-form-error', 'hero-form-success');
  initForm('waitlist-form', 'form-error', 'form-success');

  // --- Smooth Scroll for anchor links ---
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  // --- Cursor-Reactive Specular for Glass Cards ---
  if (!prefersReduced) {
    document.querySelectorAll('.step-card, .proof-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = ((e.clientX - rect.left) / rect.width) * 100;
        var y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
        // Physical tilt — subtle perspective rotation
        var rotateY = ((x - 50) / 50) * 2;
        var rotateX = ((y - 50) / 50) * -2;
        card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-2px) scale(1.015)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '30%');
        card.style.transform = '';
      });
    });
  }

  // --- Scroll Reveal ---
  if (!prefersReduced) {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length > 0 && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
      });

      reveals.forEach(function (el) {
        observer.observe(el);
      });
    }
  }

  // --- Button Jelly Re-trigger ---
  if (!prefersReduced) {
    document.querySelectorAll('.btn-primary').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        // Force animation restart by removing and re-adding
        btn.style.animation = 'none';
        btn.offsetHeight; // trigger reflow
        btn.style.animation = '';
      });
    });
  }
})();
