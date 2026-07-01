# Further Development

This note outlines how EconPulse would evolve from a prototype into a production-ready economics monitoring agent.

---

## Phase 1 — Foundation (1–2 weeks)

| Improvement | Why |
|---|---|
| **PostgreSQL + Redis** | Replace `config.json` with a real database. Persistent config, cross-run dedup, query history. |
| **Cron scheduling** | Replace manual Refresh with scheduled runs (every 4h via cron or Vercel cron jobs). Configurable intervals per topic. |
| **Auth & multi-user** | Basic JWT auth so multiple users can maintain their own watchlists. |
| **Rate-limit & retry handling** | Respect NewsAPI rate limits. Exponential backoff on NewsAPI and LLM calls. |

## Phase 2 — Smarter Agent (2–4 weeks)

| Improvement | Why |
|---|---|
| **Cross-run dedup** | Store article hashes in DB — never show the same article twice across runs. |
| **Sentiment & trend analysis** | Track sentiment over time per category/topic. Detect rising/falling narrative velocity. |
| **Alerting** | Email/webhook alerts when an article scores importance 4–5 or mentions a competitor. |
| **Better source scoring** | Weight sources by historical relevance. Auto-suggest new sources based on topic coverage. |
| **Parallel LLM chunking** | For large result sets, split articles into chunks and classify in parallel (faster + cheaper per chunk). |

## Phase 3 — Production Polish (4–8 weeks)

| Improvement | Why |
|---|---|
| **Historical dashboard** | Charts: article volume over time, category breakdown, importance distribution. |
| **Custom LLM fine-tune** | Fine-tune a small model on labelled economics news for cheaper/faster inference. |
| **Multi-country tracking** | Let users monitor multiple countries side-by-side. |
| **Search & archive** | Index past articles for full-text search. |
| **WebSocket live updates** | Push new articles to the dashboard as they're fetched and classified. |

## Phase 4 — Scale (8+ weeks)

| Improvement | Why |
|---|---|
| **More news sources** | Integrate Bloomberg API, Financial Times, RSS feeds, Twitter/X lists — not just NewsAPI. |
| **Competitor intelligence** | Track competitor mentions over time with trendlines. Auto-detect new competitor signals. |
| **Team collaboration** | Shared watchlists, annotations, comments on articles. |
| **Mobile app** | React Native app for push notifications on the go. |
| **Public API** | Expose a documented REST API for third-party integrations. |

---

## Key Production Considerations

- **LLM cost optimization** — At scale, classify with a small fine-tuned model and only use GPT-4/Gemini Pro for edge cases or high-importance articles.
- **NewsAPI free tier limit** (100 req/day) — Move to a paid plan or add RSS feeds as a free secondary source.
- **Cold starts on Vercel** — For a always-on experience, migrate the backend to a fixed server (Railway, Fly.io, or a $5 VPS).
- **Monitoring** — Add Sentry for error tracking and Grafana for pipeline metrics (articles fetched, classified, alert-triggered).
