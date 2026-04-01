(() => {
  const STORAGE_KEY = 'one_thought_entries';
  const MAX_CHARS   = 120;

  // ── Seed thoughts (shown when pool is empty) ──
  const SEEDS = [
    "I keep meaning to call people I miss, and I never do.",
    "Most of the time I'm performing being okay.",
    "I wonder if the version of me from five years ago would be proud.",
    "Some mornings the light comes in and everything feels survivable.",
    "I don't think I've ever told anyone my actual favorite song.",
    "Adulthood is mostly just being tired and pretending you're not.",
    "There are books I keep recommending that changed me, quietly.",
    "I miss people who are still alive.",
    "The kindest thing anyone ever said to me, I've never forgotten.",
    "I think about coincidences more than I admit.",
    "Sometimes I want to disappear, not forever, just for a Tuesday.",
    "I talk to myself more than I talk to anyone else.",
    "My most honest moments happen alone in the car.",
    "I'm still carrying something I should have put down years ago.",
    "I pretend to be busier than I am so I don't have to explain myself.",
  ];

  // ── DOM refs ──
  const strangerView  = document.getElementById('stranger-view');
  const writeView     = document.getElementById('write-view');
  const readView      = document.getElementById('read-view');
  const strangerText  = document.getElementById('stranger-text');
  const readText      = document.getElementById('read-text');
  const thoughtInput  = document.getElementById('thought-input');
  const charCount     = document.getElementById('char-count');
  const charRow       = document.querySelector('.char-row');
  const submitBtn     = document.getElementById('submit-btn');
  const nextBtn       = document.getElementById('next-btn');
  const writeBtn      = document.getElementById('write-btn');
  const cancelBtn     = document.getElementById('cancel-btn');
  const againBtn      = document.getElementById('again-btn');

  // ── State ──
  let currentStrangerIndex = -1;

  // ── Storage helpers ──
  function getEntries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { return []; }
  }

  function saveEntry(text) {
    const entries = getEntries();
    entries.push({ text: text.trim(), ts: Date.now() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function getPool() {
    const stored = getEntries().map(e => e.text);
    return stored.length > 0 ? stored : SEEDS;
  }

  function randomThought(exclude) {
    const pool = getPool().filter(t => t !== exclude);
    if (pool.length === 0) return getPool()[0] || SEEDS[0];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // ── View transitions ──
  function showView(next, prev) {
    if (prev) {
      prev.classList.add('exit-up');
      setTimeout(() => {
        prev.classList.add('hidden');
        prev.classList.remove('exit-up');
      }, 650);
    }
    next.classList.remove('hidden');
    // force reflow so transition fires
    next.getBoundingClientRect();
  }

  // ── Thought swap animation ──
  function swapThought(el, newText, cb) {
    el.classList.add('swap-out');
    setTimeout(() => {
      el.textContent = newText;
      el.classList.remove('swap-out');
      el.classList.add('swap-in');
      setTimeout(() => el.classList.remove('swap-in'), 450);
      if (cb) cb();
    }, 350);
  }

  // ── Init: show a random stranger thought ──
  function init() {
    const thought = randomThought(null);
    currentStrangerIndex = thought;
    strangerText.textContent = thought;
    strangerText.classList.add('swap-in');
    setTimeout(() => strangerText.classList.remove('swap-in'), 450);
  }

  // ── Next thought ──
  nextBtn.addEventListener('click', () => {
    const next = randomThought(currentStrangerIndex);
    swapThought(strangerText, next, () => {
      currentStrangerIndex = next;
    });
  });

  // ── Write ──
  writeBtn.addEventListener('click', () => {
    showView(writeView, strangerView);
    setTimeout(() => {
      thoughtInput.focus();
      autoResize();
    }, 200);
  });

  cancelBtn.addEventListener('click', () => {
    showView(strangerView, writeView);
    thoughtInput.value = '';
    updateChar();
  });

  // ── Textarea ──
  thoughtInput.addEventListener('input', () => {
    autoResize();
    updateChar();
    submitBtn.disabled = thoughtInput.value.trim().length === 0;
  });

  // Prevent Enter from submitting (force single thought discipline)
  thoughtInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!submitBtn.disabled) submitBtn.click();
    }
  });

  function autoResize() {
    thoughtInput.style.height = 'auto';
    thoughtInput.style.height = thoughtInput.scrollHeight + 'px';
  }

  function updateChar() {
    const len = thoughtInput.value.length;
    charCount.textContent = len;
    charRow.classList.remove('near-limit', 'at-limit');
    if (len >= MAX_CHARS)       charRow.classList.add('at-limit');
    else if (len >= MAX_CHARS * 0.85) charRow.classList.add('near-limit');
  }

  // ── Submit ──
  submitBtn.addEventListener('click', () => {
    const text = thoughtInput.value.trim();
    if (!text) return;

    saveEntry(text);

    // transition to read view
    readText.textContent = '';
    showView(readView, writeView);

    // animate the text appearing word by word
    setTimeout(() => typeThought(readText, text), 300);

    // reset write view for next time
    thoughtInput.value = '';
    thoughtInput.style.height = 'auto';
    updateChar();
    submitBtn.disabled = true;
  });

  // ── Word-by-word reveal ──
  function typeThought(el, text) {
    const words = text.split(' ');
    el.textContent = '';
    el.style.opacity = 1;

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = (i === 0 ? '' : ' ') + word;
      span.style.opacity = '0';
      span.style.display = 'inline';
      span.style.transition = `opacity 0.4s ease ${i * 0.09}s`;
      el.appendChild(span);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          span.style.opacity = '1';
        });
      });
    });
  }

  // ── Again ──
  againBtn.addEventListener('click', () => {
    const next = randomThought(null);
    currentStrangerIndex = next;
    swapThought(strangerText, next);
    showView(strangerView, readView);
  });

  // ── Boot ──
  init();

})();
