# EconPulse

An AI-powered economics news monitoring agent. Tracks news for a country's economy, filters noise with Google Gemini, classifies articles by category, and displays them in a structured dashboard.

Built with the **MERN stack** (MongoDB-pending, config.json for now) — Express backend + React frontend.

## Prerequisites

- Node.js 18+
- [NewsAPI.org](https://newsapi.org) API key
- Google Gemini API key

## Setup

```bash
# Backend
cd backend
npm install
echo "NEWSAPI_KEY=your_key" >> .env
echo "GEMINI_API_KEY=your_key" >> .env
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
| GET | `/news/run` | Run full pipeline: fetch → AI filter → classify → return sorted |

## Architecture

See [Context/AGENT_SPEC.md](Context/AGENT_SPEC.md) for the full spec and [Context/Agent.md](Context/Agent.md) for agent guidance.
