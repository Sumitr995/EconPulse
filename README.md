# EconPulse

An AI-powered economics news monitoring agent. Fetches news via NewsAPI, filters noise using **Gemini** or **OpenAI**, classifies articles into economic categories, scores importance, and displays everything in a structured dashboard built with React + shadcn/ui.

## Features

- **News pipeline** — Fetch latest economics articles from configured sources/domains via NewsAPI.org
- **AI triage** — Send all articles in one LLM call (Gemini or OpenAI) to filter noise, classify by category (`Monetary Policy | Trade | Fiscal | Markets | Competitor | Other`), assign importance (1–5), and write a plain-English summary
- **Keyword fallback** — If no AI key is set, uses a keyword-overlap heuristic so the demo runs with zero AI cost
- **Configurable tracking** — Add/remove topics, sources, and competitors the agent monitors via API or UI sidebar
- **Grouped dashboard** — News cards organized by category with importance badges, clickable titles, and summaries
- **Persistent config** — Topics/sources/competitors saved to `config.json` (no database required)

## Prerequisites

- Node.js 18+
- [NewsAPI.org](https://newsapi.org) API key
- Google Gemini **or** OpenAI API key (optional — falls back to keyword matching without it)

## Setup

```bash
# Backend
cd backend
npm install
echo "NEWSAPI_KEY=your_key" >> .env
echo "AI_API_KEY=your_key" >> .env      # Gemini or OpenAI key
echo "AI_PROVIDER=gemini" >> .env       # or "openai"
node server.js   # starts on port 4000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev      # Vite dev server, proxies /api -> localhost:4000
```

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/config` | Get current config (country, topics, sources, competitors) |
| POST | `/topics` | Add topic `{ value }` |
| DELETE | `/topics/:value` | Remove topic |
| POST | `/sources` | Add source `{ value }` |
| DELETE | `/sources/:value` | Remove source |
| POST | `/competitors` | Add competitor `{ value }` |
| DELETE | `/competitors/:value` | Remove competitor |
| GET | `/news/run` | Run full pipeline: fetch → dedupe → AI filter/classify → sort → return |

## Non-goals (prototype limitations)

- No database (config.json only)
- No auth or multi-user
- No cron/scheduling (manual refresh only)
- No retry/backoff/rate-limit handling
- No cross-run dedup
- API keys never exposed in frontend code or network requests

## Architecture

See [Context/AGENT_SPEC.md](Context/AGENT_SPEC.md) for the full spec and [Context/Agent.md](Context/Agent.md) for agent guidance.
