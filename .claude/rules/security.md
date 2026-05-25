# Security Rules — Musician Portfolio

## Credentials

- `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` never go in code — always in `.env` (gitignored)
- `.env*` NEVER enters a commit. Only `.env.example` with placeholder values is committed
- Before any `git add` or push, verify `.gitignore` contains `.env`
- `scripts/fetch-spotify.js` is the **only** file authorized to read `.env` values

```js
// Correct — server-side only, never reaches the browser
import 'dotenv/config';
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
```

## Client-side safety

- Secrets must **never** appear in `index.html`, `js/`, or `css/` — not even as comments
- `data/spotify.json` must contain only public data (track names, URLs, images) — never tokens, never credentials
- `fetch-spotify.js` must never write `.env` values into `spotify.json`, even indirectly
- No credential is ever passed to `console.log`, the UI, or an error message

```js
// WRONG — never do this in any client-side file
const token = 'BQD...'; // hardcoded bearer token

// CORRECT — data/spotify.json only contains public fields
{ "title": "Track Name", "previewUrl": "https://...", "coverUrl": "https://..." }
```

## DOM safety

- Never use `innerHTML` with unsanitized input
- Values coming from `data/spotify.json` must be treated as untrusted — insert via `textContent` or escape before using `innerHTML`
- `createElement` + `textContent` is the safe default for dynamic content

```js
// WRONG
el.innerHTML = track.title;

// CORRECT
el.textContent = track.title;
```

## Contact form

The contact section uses **Netlify Forms** — Netlify stores submissions and applies basic spam filtering automatically.

**What Netlify covers:**
- HTTPS on all form submissions
- Submission storage in the Netlify dashboard
- Basic spam filtering

**What must be kept in the code:**
- `data-netlify-honeypot="bot-field"` on the `<form>` tag — catches most bots without a CAPTCHA
- A hidden `<input type="hidden" name="bot-field" />` paired with the honeypot attribute
- All user input rendered to the DOM via `textContent` only — never `innerHTML`

**Never do:**
- Render a submitted value (name, email, message) back to the DOM after submission — show only a static success message
- Remove the honeypot input without replacing it with equivalent bot protection

**Free tier limit:** 100 submissions/month on Netlify. If the volume grows, upgrade the plan or add `data-netlify-recaptcha="true"` and a `<div data-netlify-recaptcha="true">` in the form.

## Git hygiene

- Before any commit or push, scan staged files for: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, or any bearer token pattern (`Bearer `, `BQ...`)
- If a pre-push hook or manual scan finds a credential: abort, remove from history with `git filter-repo`, rotate the key immediately

## Adding new integrations

If a new service requires credentials, follow this order **before writing any code**:

1. Add the key name to `.gitignore` (if a new file) or confirm `.env` is already listed
2. Add the variable name to the sensitive variable list in `CLAUDE.md`
3. Add a placeholder entry to `.env.example`
4. Only then implement the integration — server/script-side only

**Current sensitive variables (server/script-side only):**

```
SPOTIFY_CLIENT_ID
SPOTIFY_CLIENT_SECRET
```
