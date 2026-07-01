# EconPulse — Agent Instructions

## Stack
- **Backend**: Node.js (ESM) + Express, port 5000
- **Frontend**: React + Vite + shadcn/ui + Tailwind
- **AI**: Gemini (`gemini`) or OpenAI (`openai`) — set via `AI_PROVIDER` env var, key via `AI_API_KEY`
- **News**: NewsAPI.org (`NEWSAPI_KEY`)
- **No database**: config.json for persistence, in-memory only

## Key commands
```bash
# Backend (from /backend)
node server.js

# Frontend (from /frontend)
npm run dev
```

## Architecture
```
/backend
  server.js         # Express entry — routes: /config, /topics, /sources, /competitors, /news/run
  config.json       # seeded list of topics, sources, competitors
  src/
    configStore.js  # read/write/add/remove config.json
    newsFetcher.js  # NewsAPI fetch + dedup
    aiFilter.js     # Gemini/OpenAI call: filter noise + classify + score
/frontend
  src/
    App.jsx
    api.js          # axios client to /api/*
    components/
      Sidebar.jsx   # topics/sources/competitors chips + add/remove
      NewsFeed.jsx  # cards grouped by category
```

## Pipeline (`GET /news/run`)
1. Read config.json
2. NewsAPI `everything({ q: topics+competitors joined, domains: sources, language: 'en', sortBy: 'publishedAt' })`
3. Dedupe by normalized title
4. Send batch to AI with system prompt (see Context/AGENT_SPEC.md:94-106)
5. Filter `relevant:false`, sort by `importance` desc → `publishedAt` desc
6. Return array

## Fallback (no LLM key)
If `AI_API_KEY` is empty/missing, skip step 4-5 and use keyword-overlap heuristic:
keep articles whose title+description contains ≥1 topic/competitor term, importance = count of matched terms (capped at 5), category = "Other".

## Data models
**config.json** — `{ country, topics[], sources[], competitors[] }`

**Classified article** — `{ title, url, source, publishedAt, category, importance (1-5), summary, relevant }`
Categories: `"Monetary Policy" | "Trade" | "Fiscal" | "Markets" | "Competitor" | "Other"`

## Frontend details
- On load: fetch `/config` + `/news/run` (show loading skeleton)
- Sidebar: 3 sections (Topics / Sources / Competitors), removable chips + add input
- News: cards grouped by category, importance as shadcn `Badge`, clickable title, summary
- Refresh button calls `/news/run` again
- Vite config must proxy `/api` → `http://localhost:5000`

## Environment variables (`.env` in /backend)
```
NEWSAPI_KEY=...
AI_API_KEY=...           # Gemini or OpenAI key
AI_PROVIDER=gemini       # or "openai"
```

## Non-goals (don't build)
- No database (config.json only)
- No auth, no multi-user
- No cron/scheduling (manual Refresh only)
- No retry/backoff/rate-limit for AI or NewsAPI calls
- No cross-run dedup

## Gotchas
- Backend must be started **before** frontend
- `.env` lives in `/backend`, not root
- Use `AI_API_KEY` + `AI_PROVIDER=gemini|openai` — NOT `ANTHROPIC_API_KEY`
- config.json is committed with seed data; `.env` is gitignored
- NewsAPI free tier has limited requests/min — avoid spamming `/news/run`
