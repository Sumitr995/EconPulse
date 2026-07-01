import NewsAPI from "newsapi";

export async function fetchArticles(config, queryOverride = "") {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];

  const newsapi = new NewsAPI(apiKey);
  const q = queryOverride || (config.topics.length ? `(${config.topics.join(" OR ")}) AND ${config.country} economy` : `${config.country} economy`);
  const domains = config.sources.join(",");

  const response = await newsapi.v2.everything({
    q,
    domains,
    language: "en",
    sortBy: "publishedAt",
    pageSize: 50,
  });

  if (!response.articles) return [];

  const seen = new Set();
  return response.articles
    .filter((a) => {
      const key = a.title?.toLowerCase().trim();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      urlToImage: a.urlToImage,
      source: a.source?.name || a.source,
      publishedAt: a.publishedAt,
    }));
}
