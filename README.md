<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/EconPulse-AI%20News%20Agent-7c3aed?style=for-the-badge&logo=openai&logoColor=white&labelColor=1e1b4b">
    <img alt="EconPulse" src="https://img.shields.io/badge/EconPulse-AI%20News%20Agent-7c3aed?style=for-the-badge&logo=openai&logoColor=white&labelColor=1e1b4b">
  </picture>
</p>

<p align="center">
  <b>AI-powered economics news monitoring agent</b><br>
  Fetches, filters, classifies, and scores economic news in real time.
</p>

<p align="center">
  <a href="https://econ-pulse-six.vercel.app/">
    <img src="https://img.shields.io/badge/Frontend-Vercel-000?style=flat-square&logo=vercel" alt="Frontend">
  </a>
  <a href="https://econ-pulse-backend.vercel.app/">
    <img src="https://img.shields.io/badge/Backend-Vercel-000?style=flat-square&logo=vercel" alt="Backend">
  </a>
  <img src="https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/Express-4.21-000?style=flat-square&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/Gemini-OpenAI-8B5CF6?style=flat-square&logo=googlegemini" alt="Gemini + OpenAI">
</p>

---

## Overview

**EconPulse** is an intelligent news agent that tracks a country's economic landscape. It pulls articles from NewsAPI.org, runs them through an LLM (Gemini 2.0 Flash or GPT-4o-mini) to filter noise, classify into economic categories, score importance, and presents everything in a clean editorial-style dashboard.

Built in **~2 hours** for the **Swift Robotics** internship assessment.

<p align="center">
  <a href="https://www.loom.com/share/34aa7540812c45d9b0f8f9f0468f42eb">
    <img src="https://img.shields.io/badge/Walkthrough-Loom-625DF5?style=for-the-badge&logo=loom" alt="Loom Walkthrough">
  </a>
</p>

---

## Architecture

```
┌─────────────┐     ┌─────────────────────────────────────┐     ┌──────────────┐
│  React 19   │────▶│   Express REST API (Node.js ESM)    │────▶│  NewsAPI.org │
│  Tailwind 4 │     │                                     │     │              │
│  shadcn/ui  │     │  ┌──────────┐  ┌─────────────────┐  │     └──────────────┘
│  Vite       │     │  │ Fetcher  │  │  AI Filter      │  │            │
└─────────────┘     │  │(dedup)   │──▶│ Gemini / OpenAI  │  │            │
       ▲            │  └──────────┘  │ Keyword Fallback │  │            │
       │            │                └─────────────────┘  │            │
  Frontend          │                                     │            │
  (Vercel)          └─────────────────────────────────────┘            │
                           Backend (Vercel)                            │
                                                                       ▼
                                                               ┌──────────────┐
                                                               │  config.json │
                                                               │ (persistence) │
                                                               └──────────────┘
```

---

## Features

- **News Pipeline** — Fetches latest economics articles from NewsAPI.org based on configured topics, sources, and competitor terms.
- **AI-Powered Triage** — Sends all fetched articles in a single LLM call to:
  - Filter irrelevant articles
  - Classify into 6 categories: `Monetary Policy`, `Trade`, `Fiscal`, `Markets`, `Competitor`, `Other`
  - Assign importance score 1–5
  - Generate a plain-English one-sentence summary
- **Keyword Fallback Mode** — No AI API key? No problem. Falls back to a keyword-overlap heuristic so the demo runs at zero cost.
- **Configurable Tracking** — Add/remove topics, news sources (domains), and competitor terms via the UI sidebar or REST API.
- **Deduplication** — Normalizes and deduplicates articles by title within each pipeline run.
- **Categorized Dashboard** — News cards grouped by AI-assigned category with source, date, and summary.
- **Section Filters** — Top stories filterable by "For you", "Business", "Markets", "Policy", "Technology" — all client-side, no extra API calls.
- **Featured Story** — The most important article displayed as a hero story.
- **Persistent Configuration** — Topics, sources, and competitors saved to `config.json` (survives restarts locally).
- **Vercel-Ready** — Config store automatically switches to in-memory mode in serverless environments.
- **Loading Skeletons & Error Handling** — Polished UX even when data is loading or the backend is unreachable.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Card, Button, Input, Badge components |
| **Axios** | HTTP client |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js** (ESM) | Runtime |
| **Express 4.21** | REST API framework |
| **NewsAPI** | News data source |
| **Google Gemini 2.0 Flash** | Primary AI classifier |
| **OpenAI GPT-4o-mini** | Alternative AI provider |
| **dotenv / cors** | Configuration & cross-origin |

### Deployment

| Service | URL |
|---|---|
| Frontend | [https://econ-pulse-six.vercel.app/](https://econ-pulse-six.vercel.app/) |
| Backend | [https://econ-pulse-backend.vercel.app/](https://econ-pulse-backend.vercel.app/) |

---

## Quick Start

```bash
# 1. Backend
cd backend
npm install
# Create .env with your keys (see .env.example)
echo "NEWSAPI_KEY=your_newsapi_key" >> .env
echo "AI_API_KEY=your_gemini_or_openai_key" >> .env
echo "AI_PROVIDER=gemini" >> .env
node server.js    # Starts on http://localhost:5000

# 2. Frontend (separate terminal)
cd frontend
npm install
npm run dev       # Vite dev server on http://localhost:5173
```

> No AI API key? The app auto-falls back to keyword-based filtering — fully functional, zero cost.

---

## API Reference

| Method | Path | Description |
|--------|------|-------------|
| GET | `/config` | Get current configuration |
| POST | `/topics` | Add topic `{ "value": "inflation" }` |
| DELETE | `/topics/:value` | Remove a topic |
| POST | `/sources` | Add source domain `{ "value": "reuters.com" }` |
| DELETE | `/sources/:value` | Remove a source |
| POST | `/competitors` | Add competitor `{ "value": "China economy" }` |
| DELETE | `/competitors/:value` | Remove a competitor |
| GET | `/news/run` | Run full pipeline: fetch → dedupe → AI classify → return |

---

## Project Structure

```
EconPulse/
├── backend/
│   ├── server.js              # Entry point (port 5000)
│   ├── app.js                 # Express app setup
│   ├── config.json            # Persistent configuration
│   ├── src/
│   │   ├── configStore.js     # JSON config read/write (Vercel-aware)
│   │   ├── newsFetcher.js     # NewsAPI fetch + dedup
│   │   └── aiFilter.js        # LLM filter (Gemini/OpenAI) + keyword fallback
│   ├── routes/                # Route definitions
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic orchestration
│   └── middleware/            # Error handler, body validation
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main app (state, layout, sections)
│   │   ├── api.js             # Axios client
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Config panel (topics/sources/competitors)
│   │   │   ├── NewsFeed.jsx   # Categorized news cards
│   │   │   └── ui/            # shadcn/ui primitives
│   │   └── assets/
│   └── vite.config.js         # Vite config with /api proxy
└── Context/                   # Design docs & original spec
```

---

## Design Decisions

- **Single LLM call per pipeline run** — All articles are classified in one batch call instead of one-per-article, reducing cost and latency.
- **Dual AI provider** — Supports both Gemini and OpenAI (switch via `AI_PROVIDER` env var). Same system prompt, identical output format.
- **Zero-cost fallback** — Keyword-overlap heuristic means the app works out of the box without any paid API keys.
- **Layered backend** — Routes → Controllers → Services → Core logic (`src/`). Keeps concerns separate and modules independently testable.
- **Client-side section filtering** — No extra API calls when switching between "Business", "Markets", etc. — all done with keyword matching in the frontend.

---

## Prototype Limitations

- No database (persists to `config.json` / in-memory on Vercel)
- No auth or multi-user support
- No cron scheduling (manual refresh only)
- No cross-run deduplication
- No retry/backoff/rate-limit handling

---

<p align="center">
  Built in ~2 hours for the <b>Swift Robotics</b> internship assessment.
</p>
