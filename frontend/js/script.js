/* ─────────────────────────────────────────────
   AI Disease Outbreak Prediction System
   script.js — Main JavaScript
───────────────────────────────────────────── */

// ─── NAVBAR SCROLL EFFECT ───
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ─── MOBILE NAV TOGGLE ───
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navLinks.classList.contains('open')
      ? (spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)',
         spans[1].style.opacity = '0',
         spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)')
      : (spans[0].style.transform = '',
         spans[1].style.opacity = '',
         spans[2].style.transform = '');
  });
}

// ─── INTERSECTION OBSERVER (scroll animations) ───
const animEls = document.querySelectorAll('.animate-in');
if (animEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => io.observe(el));
}

// ─── COUNTER ANIMATION (hero stats) ───
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;
  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, step);
}

const counters = document.querySelectorAll('[data-target]');
if (counters.length) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));
}

// ─── PREDICTION FORM LOGIC ───
const predictForm = document.getElementById('predictForm');
if (predictForm) {
  const inputs = predictForm.querySelectorAll('.form-input');
  const btn = document.getElementById('predictBtn');
  const btnText = document.getElementById('btnText');
  const spinner = document.getElementById('btnSpinner');
  const resultCard = document.getElementById('resultCard');
  const resultValue = document.getElementById('resultValue');
  const riskBadge = document.getElementById('riskBadge');
  const resultBar = document.getElementById('resultBar');

  // ── Validate individual field ──
  function validateField(input) {
    const val = input.value.trim();
    if (val === '' || isNaN(Number(val))) {
      input.classList.add('error');
      return false;
    }
    input.classList.remove('error');
    return true;
  }

  inputs.forEach(input => {
    input.addEventListener('input', () => validateField(input));
    input.addEventListener('blur', () => validateField(input));
  });

  // ── Risk logic ──
  function getRisk(val) {
    // val is now in MILLIONS

    if (val < 5) {
        return {
            level: 'Low',
            cls: 'risk-low',
            barCls: 'low',
            pct: Math.min((val / 5) * 33, 33)
        };
    }

    if (val < 20) {
        return {
            level: 'Medium',
            cls: 'risk-medium',
            barCls: 'medium',
            pct: 33 + Math.min(((val - 5) / 15) * 34, 34)
        };
    }

    return {
        level: 'High',
        cls: 'risk-high',
        barCls: 'high',
        pct: 67 + Math.min(((val - 20) / 30) * 33, 33)
    };
}

  // ── Render result ──
  function showResult(prediction) {
    const rounded = prediction/ 1000000;
    const risk = getRisk(rounded);

    resultValue.innerHTML = rounded.toFixed(2) + ' Million <span>predicted cases</span>';

    riskBadge.className = `risk-badge ${risk.cls}`;
    riskBadge.innerHTML = `<span class="risk-dot"></span>${risk.level} Risk`;

    resultBar.className = `result-bar ${risk.barCls}`;
    resultCard.classList.add('visible');

    // animate bar
    setTimeout(() => {
      resultBar.style.width = risk.pct + '%';
    }, 50);
  }

  // ── Submit ──
  predictForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    let valid = true;
    inputs.forEach(i => { if (!validateField(i)) valid = false; });
    if (!valid) {
      showToast('Please fill in all fields with valid numbers.');
      return;
    }

    const payload = {
      growth_rate:  parseFloat(document.getElementById('growthRate').value),
      retail:       parseFloat(document.getElementById('retail').value),
      workplaces:   parseFloat(document.getElementById('workplaces').value),
      residential:  parseFloat(document.getElementById('residential').value),
    };

    // loading state
    btn.disabled = true;
    btnText.textContent = 'Analysing…';
    spinner.style.display = 'block';
    resultCard.classList.remove('visible');
    resultBar.style.width = '0';

    try {
      const res = await fetch("https://episight-ai.onrender.com/predict", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
});

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (data.prediction === undefined) throw new Error('Invalid response from server.');

      showResult(data.prediction);

    } catch (err) {
      showToast(err.message.includes('Failed to fetch')
        ? 'Cannot reach the server. Is Flask running on port 5000?'
        : err.message
      );
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Predict Cases';
      spinner.style.display = 'none';
    }
  });
}

// ─── TOAST ───
function showToast(message) {
  let toast = document.getElementById('errorToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'errorToast';
    toast.className = 'error-toast';
    toast.innerHTML = `
      <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <span id="toastMsg"></span>`;
    document.body.appendChild(toast);
  }
  document.getElementById('toastMsg').textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 4000);
}

// ─── ACTIVE NAV LINK ───
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
