# AGENT_SPEC.md — Economics News Monitoring Agent

## Already built — do not regenerate these
The following files already exist and work. Extend the project around them, don't rewrite:
- `package.json` (type: module, deps: `newsapi`, `dotenv`, `express`, `cors`)
- `.env` (has `NEWSAPI_KEY` set, `ANTHROPIC_API_KEY` empty — leave empty, code must handle that)
- `.gitignore` (ignores node_modules, .env, reports/)
- `config.json` (topics/sources/competitors seed data)
- `src/configStore.js` — `getConfig()`, `saveConfig()`, `addItem(list, value)`, `removeItem(list, value)`
- `src/newsFetcher.js` — `fetchArticles(config)` using the `newsapi` npm package, returns deduped array of `{title, description, url, source, publishedAt}`

## What's left to build
1. `src/aiFilter.js` — the LLM filter/classify step (spec below).
2. `server.js` — Express app wiring the routes below to `configStore.js` / `newsFetcher.js` / `aiFilter.js`.
3. `/frontend` — React + Vite + shadcn/ui + Tailwind dashboard.

## Setup commands (backend already has these installed — frontend needs scaffolding)
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios
npx shadcn@latest init
npx shadcn@latest add card badge button input
```
Run backend: `node server.js` (port 5000). Run frontend: `npm run dev` inside `/frontend`, proxy `/api` → `http://localhost:5000` in `vite.config.js`.

## Goal
An AI agent that monitors news related to a country's economics, filters out noise,
classifies what's left, and displays it in a structured dashboard. User can add/remove
the topics, sources, and competitors the agent tracks.

## Architecture
```
/backend                # Express API (Node, ESM)
  server.js
  config.json           # persisted state: topics, sources, competitors
  src/configStore.js     # read/write/add/remove on config.json
  src/newsFetcher.js     # NewsAPI.org integration
  src/aiFilter.js        # Anthropic call: noise filter + classify
/frontend                # React (Vite) + shadcn/ui + Tailwind
  src/App.jsx
  src/api.js             # axios client
  src/components/Sidebar.jsx     # manage topics/sources/competitors
  src/components/NewsFeed.jsx    # grouped, sorted news cards
```

## Data model

**config.json**
```json
{
  "country": "India",
  "topics": ["inflation", "GDP growth", "RBI monetary policy"],
  "sources": ["reuters.com", "bloomberg.com", "livemint.com"],
  "competitors": ["China economy", "US Federal Reserve"]
}
```

**Classified article (backend → frontend shape)**
```json
{
  "title": "...",
  "url": "...",
  "source": "...",
  "publishedAt": "...",
  "category": "Monetary Policy | Trade | Fiscal | Markets | Competitor | Other",
  "importance": 1,
  "summary": "one-line plain-English summary",
  "relevant": true
}
```

## Backend routes

| Method | Path | Body | Behavior |
|---|---|---|---|
| GET | `/config` | – | returns full config.json |
| POST | `/topics` | `{ value }` | adds topic if not duplicate |
| DELETE | `/topics/:value` | – | removes topic |
| POST | `/sources` | `{ value }` | adds source domain |
| DELETE | `/sources/:value` | – | removes source domain |
| POST | `/competitors` | `{ value }` | adds competitor |
| DELETE | `/competitors/:value` | – | removes competitor |
| GET | `/news/run` | – | runs full pipeline: fetch → dedupe → AI filter/classify → return sorted array |

## Pipeline (`GET /news/run`)
1. Read config.json.
2. Build a NewsAPI query using the official `newsapi` npm package
   (`npm install newsapi`, `import NewsAPI from "newsapi"`, `new NewsAPI(process.env.NEWSAPI_KEY)`).
   Call `newsapi.v2.everything({ q, domains, language: 'en', sortBy: 'publishedAt' })` where
   `q = topics + competitors OR-joined` and `domains = sources.join(',')`.
3. Dedupe articles by normalized title.
4. Send the batch to the LLM in ONE call with this system prompt:

   ```
   You are a news triage assistant for an economics monitoring agent tracking {country}.
   Given a JSON array of articles (title, description, source, url), return ONLY a JSON
   array (no prose, no markdown fences) where each object has:
   { "title", "url", "source", "publishedAt", "category", "importance", "summary", "relevant" }

   - relevant: false if the article is noise (celebrity gossip mixed into feed, duplicate
     story, opinion/listicle with no economic substance, or unrelated to {country}'s economy).
   - category: one of "Monetary Policy", "Trade", "Fiscal", "Markets", "Competitor", "Other".
   - importance: 1-5, where 5 = major policy/market-moving event, 1 = minor/local update.
   - summary: one plain-English sentence, no jargon.
   ```

5. Filter out `relevant:false`, sort by `importance` desc then `publishedAt` desc.
6. Return the array.

## Fallback (no LLM key set)
If `AI_API_KEY` is missing, skip step 4-5's LLM call and instead do a keyword-overlap
heuristic: keep articles whose title+description contains ≥1 configured topic/competitor
term, assign importance = count of matched terms (capped at 5), category = "Other".
This keeps the demo runnable with zero AI cost if needed.

## Frontend behavior
- On load: `GET /config` and `GET /news/run` (show loading skeleton while news loads).
- Sidebar: three sections (Topics / Sources / Competitors), each a list of removable chips
  + an input+button to add a new one. Adding/removing calls the API then refetches `/config`.
- Main panel: news cards grouped by `category`, each card shows title (linked), source,
  importance as a shadcn `Badge` (color scales with value), and the one-line summary.
- A "Refresh" button re-triggers `GET /news/run`.

## Explicit non-goals for this prototype (mention in Loom)
- No database (config.json + in-memory only) — would move to Postgres/Redis in production.
- No auth, no multi-user support.
- No scheduling/cron — manual "Refresh" only.
- Single LLM call per run, no retry/backoff, no rate-limit handling.
- No dedup across separate runs (same article can reappear if run twice).

## Definition of done
- [ ] `node server.js` starts without errors on port 5000.
- [ ] `curl localhost:5000/config` returns the seeded topics/sources/competitors.
- [ ] `curl -X POST localhost:5000/topics -H "Content-Type: application/json" -d '{"value":"test topic"}'` adds it, visible on next `/config` call.
- [ ] `curl localhost:5000/news/run` returns a JSON array of articles with all 7 fields, sorted by importance desc.
- [ ] Works with `AI_API_KEY` empty (falls back to keyword heuristic) — test this explicitly since `.env` currently has it blank.
- [ ] `npm run dev` in `/frontend` shows the sidebar (3 editable lists) and news cards grouped by category.
- [ ] Adding/removing a topic in the UI updates the sidebar without a full page reload.
- [ ] No API keys appear anywhere in frontend code or network requests visible in devtools.
