# One Thought

> *One sentence. Anonymous. Shared with the world.*

Write one thought — 120 characters max.
Read one stranger's thought every visit.
No feed. No names. No likes. No scrolling.
Just a single sentence, released into the void.

## The idea

Every app wants more from you. More words, more time, more engagement.
This one asks for exactly one sentence — then lets it go.

## How it works

- **On load** — you see a random real thought from someone, somewhere
- **Write yours** — 120 character hard limit, one sentence, no exceptions
- **Submit** — your thought appears word by word, then joins the global pool
- **Next visit** — a stranger reads yours. You read theirs.

## Features

- Word-by-word reveal animation on submit
- Smooth view transitions (no page reloads)
- Anonymous — no accounts, no tracking
- Real shared pool — every thought is from a real person
- Starts empty. You could be the first.

## Stack

- Vanilla HTML, CSS, JavaScript
- Playfair Display + Inconsolata (Google Fonts)
- Supabase (anonymous read + insert, no auth)
- Three files. Zero dependencies. Zero build step.

## Run it
```bash
# Just open it
open index.html
```

Or visit the live version on GitHub Pages.

## Backend

Thoughts are stored in a Supabase table with two columns: `text` and `created_at`.
Row Level Security is enabled — anyone can read and insert, nobody can edit or delete.
No user data is collected. No cookies. No fingerprinting.

## Credits

Crafted by [Tahir](https://tahirhassan.me)
```
