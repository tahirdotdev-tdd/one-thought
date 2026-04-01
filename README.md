# One Thought

> *One sentence. Anonymous. Nothing stored on a server.*

Write one thought — 120 characters max.
Read one stranger's thought every visit.
No feed. No names. No likes. No scrolling.
Just a single sentence, released into the void.

## The idea

Every app wants more from you. More words, more time, more engagement.
This one asks for exactly one sentence — then lets it go.

## How it works

- **On load** — you see a random thought from someone else
- **Write yours** — 120 character hard limit, one sentence, no exceptions
- **Submit** — your thought appears word by word, then joins the pool
- **Next visit** — someone else might read yours

## Features

- Word-by-word reveal animation on submit
- Smooth view transitions (no page reloads)
- Anonymous — no accounts, no tracking
- Seeded with 15 real-feeling thoughts so it never feels empty
- localStorage for demo persistence

## Stack

- Vanilla HTML, CSS, JavaScript
- Playfair Display + Inconsolata (Google Fonts)
- Three files. Open `index.html` and it works.
- Zero dependencies. Zero build step.

## Run it
```bash
# Just open it
open index.html
```

Or drop it on any static host — GitHub Pages, Netlify, Vercel.

## Notes

localStorage means thoughts persist per-browser, per-device.
For a real shared pool, swap localStorage for any lightweight backend
(Supabase, PocketBase, Firebase — a single table with one column).
```

---

**Topics/tags:**
```
one-sentence  anonymous  minimalist  vanilla-js  writing  black-and-white  calm-tech  typography  thoughts  no-framework
