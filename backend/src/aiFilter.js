export async function filterArticles(articles, config) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return keywordFilter(articles, config);

  const provider = process.env.AI_PROVIDER || "gemini";

  if (provider === "openai") {
    return openAIFilter(articles, config, apiKey);
  }
  return geminiFilter(articles, config, apiKey);
}

async function geminiFilter(articles, config, apiKey) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = buildPrompt(articles, config);
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseResponse(text);
}

async function openAIFilter(articles, config, apiKey) {
  const OpenAI = (await import("openai")).default;
  const openai = new OpenAI({ apiKey });

  const prompt = buildPrompt(articles, config);
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const text = completion.choices[0]?.message?.content || "[]";
  return parseResponse(text);
}

function buildPrompt(articles, config) {
  return `You are a news triage assistant for an economics monitoring agent tracking ${config.country}.
Given a JSON array of articles (title, description, source, url), return ONLY a JSON array (no prose, no markdown fences) where each object has:
{ "title", "url", "source", "publishedAt", "category", "importance", "summary", "relevant" }

- relevant: false if the article is noise (celebrity gossip mixed into feed, duplicate story, opinion/listicle with no economic substance, or unrelated to ${config.country}'s economy).
- category: one of "Monetary Policy", "Trade", "Fiscal", "Markets", "Competitor", "Other".
- importance: 1-5, where 5 = major policy/market-moving event, 1 = minor/local update.
- summary: one plain-English sentence, no jargon.

Articles:
${JSON.stringify(articles)}`;
}

function parseResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return [];
  }
}

function keywordFilter(articles, config) {
  const terms = [...config.topics, ...config.competitors].map((t) =>
    t.toLowerCase()
  );
  return articles
    .map((a) => {
      const text = `${a.title} ${a.description}`.toLowerCase();
      const matches = terms.filter((t) => text.includes(t));
      if (matches.length === 0) return null;
      return {
        title: a.title,
        url: a.url,
        source: a.source,
        publishedAt: a.publishedAt,
        category: "Other",
        importance: Math.min(matches.length, 5),
        summary: a.description || a.title,
        relevant: true,
      };
    })
    .filter(Boolean);
}
