# DevLens

**See deeper into your code.**

DevLens is an AI-powered code analysis and review tool for developers and
students. Paste or upload source code, and DevLens returns a structured
report: an overall score, category breakdowns (quality, security,
performance, maintainability, complexity), a list of specific issues with
suggested fixes, and a plain-language explanation of what the code does.

> **AI-generated analysis can be wrong.** DevLens does not guarantee that
> any code is secure or bug-free — always review its findings yourself.

This is a real, runnable full-stack project: a React frontend, a
Node.js/Express API, and a PostgreSQL database. You run it on your own
machine (or deploy it) — it isn't a hosted demo.

---

## 1. What you need before you start

- **Node.js 18 or newer** — check with `node -v`. Get it from
  [nodejs.org](https://nodejs.org) if needed.
- **PostgreSQL 13+** running locally, or a free hosted instance (e.g.
  [Neon](https://neon.tech) or [Supabase](https://supabase.com) both have
  free tiers and are the easiest option if you don't want to install
  Postgres yourself).
- **An AI API key** — either an [Anthropic](https://console.anthropic.com)
  key or an [OpenAI](https://platform.openai.com) key. DevLens defaults to
  Anthropic.

---

## 2. Project layout

```
devlens/
  backend/     Express API + PostgreSQL access + AI integration
  frontend/    React app (Vite)
```

The frontend and backend are two separate apps that run side by side and
talk over HTTP — start both when you work on this locally.

---

## 3. Set up the database

If you're using a hosted Postgres (Neon/Supabase), just copy the
connection string they give you — you can skip straight to step 4.

If you're running Postgres locally:

```bash
createdb devlens
```

---

## 4. Set up the backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:

- `DATABASE_URL` — your Postgres connection string
- `ANTHROPIC_API_KEY` (or set `AI_PROVIDER=openai` and fill in
  `OPENAI_API_KEY` instead)

Then create the database table and start the server:

```bash
npm run migrate
npm run dev
```

You should see `DevLens API listening on http://localhost:4000`.

---

## 5. Set up the frontend

In a **new terminal tab**:

```bash
cd frontend
npm install
npm run dev
```

Open the URL it prints (usually **http://localhost:5173**). The frontend
automatically proxies API requests to the backend, so no extra config is
needed as long as the backend is running on port 4000.

---

## 6. Using DevLens

1. Pick a language, then paste code or click **Upload file**.
2. Click **Analyze code**.
3. Read the results: **Overview** (score + category breakdown), **Issues**
   (filterable by severity, with suggested fixes), and **Explanation**
   (what the code does and how it flows).
4. Past analyses are saved automatically and show up under **History** —
   history is tied to your browser, not a login, so it's specific to this
   device.

---

## 7. Configuration reference

All backend settings live in `backend/.env` (see `.env.example` for every
option, with comments):

| Variable | What it does |
|---|---|
| `AI_PROVIDER` | `anthropic` (default) or `openai` |
| `ANTHROPIC_MODEL` / `OPENAI_MODEL` | Which model to call |
| `MAX_CODE_LENGTH` | Longest snippet DevLens will accept (default 20,000 chars) |
| `RATE_LIMIT_MAX_REQUESTS` | Analyses allowed per IP per window, to control API cost |
| `CLIENT_ORIGIN` | Frontend URL, for CORS |

---

## 8. Notes on how it works

- **No code is ever executed.** Uploaded files are read as plain text in
  the browser and analyzed as text by the AI — nothing is run on the
  server.
- **The AI call happens only on the backend.** Your AI API key is never
  sent to the browser.
- **Supported languages:** C, C++, Java, Python, JavaScript, TypeScript,
  HTML, CSS, SQL.
- If the AI returns something DevLens can't parse, the request fails
  gracefully with an error message rather than showing garbage — just
  retry.

---

## 9. Deploying

- **Frontend:** `npm run build` in `frontend/` produces a static `dist/`
  folder you can host anywhere (Vercel, Netlify, Cloudflare Pages, etc.).
  Point it at your deployed backend URL.
- **Backend:** deploy `backend/` to any Node host (Render, Railway, Fly.io,
  a VPS, etc.), set the same environment variables from `.env.example`,
  and point `CLIENT_ORIGIN` at your deployed frontend URL.
