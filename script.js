/* ============================================
   Aria Landing Page — script.js
   Email form + smooth scroll
   ============================================ */

(function () {
  'use strict';

  // --- Email Form ---
  var form = document.getElementById('waitlist-form');
  var errorEl = document.getElementById('form-error');
  var successEl = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var emailInput = document.getElementById('email-input');
      var email = emailInput.value.trim();

      // Client-side validation
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('please enter a valid email address.');
        return;
      }

      var submitBtn = form.querySelector('.btn-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = '...';

      // POST to Buttondown
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
            showError('something went wrong. please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'count me in';
          }
        })
        .catch(function () {
          showError('could not connect. please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'let me know';
        });
    });
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  // Clear error when user starts typing again
  var emailInput2 = document.getElementById('email-input');
  if (emailInput2) {
    emailInput2.addEventListener('input', function () {
      errorEl.hidden = true;
    });
  }

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
})();
