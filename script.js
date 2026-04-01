(() => {
  const MAX_CHARS = 120;

  // ── Supabase config ──
  const SB_URL = 'https://xijfanhxfbtmptetdnxw.supabase.co';
  const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpamZhbmh4ZmJ0bXB0ZXRkbnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTcyNTQsImV4cCI6MjA5MDU5MzI1NH0.0n5YSY3Tf5OdYi3TnAETd0D3tCHEH8cuyyTNSyin4Ss';
  const HEADERS = {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    'Content-Type': 'application/json',
  };

  const EMPTY_MSG = "no thoughts yet. be the first.";

  // ── DOM refs ──
  const strangerView = document.getElementById('stranger-view');
  const writeView    = document.getElementById('write-view');
  const readView     = document.getElementById('read-view');
  const strangerText = document.getElementById('stranger-text');
  const readText     = document.getElementById('read-text');
  const thoughtInput = document.getElementById('thought-input');
  const charCount    = document.getElementById('char-count');
  const charRow      = document.querySelector('.char-row');
  const submitBtn    = document.getElementById('submit-btn');
  const nextBtn      = document.getElementById('next-btn');
  const writeBtn     = document.getElementById('write-btn');
  const cancelBtn    = document.getElementById('cancel-btn');
  const againBtn     = document.getElementById('again-btn');

  // ── State ──
  let pool = [];
  let currentThought = '';

  // ── Supabase: fetch up to 200 random thoughts ──
  async function fetchPool() {
    try {
      const res = await fetch(
        `${SB_URL}/rest/v1/thoughts?select=text&order=created_at.desc&limit=200`,
        { headers: HEADERS }
      );
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      return data.map(d => d.text);
    } catch {
      return [];
    }
  }

  // ── Supabase: insert a new thought ──
  async function insertThought(text) {
    try {
      const res = await fetch(`${SB_URL}/rest/v1/thoughts`, {
        method: 'POST',
        headers: { ...HEADERS, Prefer: 'return=minimal' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('insert failed');
      // also add to local pool so "again" can show it immediately
      pool.unshift(text);
    } catch (e) {
      console.warn('Could not save to Supabase:', e);
    }
  }

  // ── Pick a random thought, excluding current ──
  function randomThought(exclude) {
    if (pool.length === 0) return EMPTY_MSG;
    const filtered = pool.filter(t => t !== exclude);
    const source   = filtered.length > 0 ? filtered : pool;
    return source[Math.floor(Math.random() * source.length)];
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
    next.getBoundingClientRect(); // force reflow
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
      requestAnimationFrame(() => requestAnimationFrame(() => {
        span.style.opacity = '1';
      }));
    });
  }

  // ── Char counter ──
  function updateChar() {
    const len = thoughtInput.value.length;
    charCount.textContent = len;
    charRow.classList.remove('near-limit', 'at-limit');
    if (len >= MAX_CHARS)             charRow.classList.add('at-limit');
    else if (len >= MAX_CHARS * 0.85) charRow.classList.add('near-limit');
  }

  function autoResize() {
    thoughtInput.style.height = 'auto';
    thoughtInput.style.height = thoughtInput.scrollHeight + 'px';
  }

  // ── Init ──
  async function init() {
    strangerText.textContent = '…';
    pool = await fetchPool();
    currentThought = randomThought(null);
    swapThought(strangerText, currentThought);
  }

  // ── Next thought ──
  nextBtn.addEventListener('click', () => {
    const next = randomThought(currentThought);
    swapThought(strangerText, next, () => { currentThought = next; });
  });

  // ── Write ──
  writeBtn.addEventListener('click', () => {
    showView(writeView, strangerView);
    setTimeout(() => { thoughtInput.focus(); autoResize(); }, 200);
  });

  cancelBtn.addEventListener('click', () => {
    showView(strangerView, writeView);
    thoughtInput.value = '';
    updateChar();
  });

  thoughtInput.addEventListener('input', () => {
    autoResize();
    updateChar();
    submitBtn.disabled = thoughtInput.value.trim().length === 0;
  });

  thoughtInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!submitBtn.disabled) submitBtn.click();
    }
  });

  // ── Submit ──
  submitBtn.addEventListener('click', async () => {
    const text = thoughtInput.value.trim();
    if (!text) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'sending…';

    await insertThought(text);

    readText.textContent = '';
    showView(readView, writeView);
    setTimeout(() => typeThought(readText, text), 300);

    thoughtInput.value = '';
    thoughtInput.style.height = 'auto';
    updateChar();
    submitBtn.textContent = 'release it';
  });

  // ── Again ──
  againBtn.addEventListener('click', () => {
    const next = randomThought(null);
    currentThought = next;
    swapThought(strangerText, next);
    showView(strangerView, readView);
  });

  // ── Boot ──
  init();

})();
