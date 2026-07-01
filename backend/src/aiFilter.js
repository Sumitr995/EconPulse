export async function filterArticles(articles, config) {
  return keywordFilter(articles, config);
}

function keywordFilter(articles, config) {
  const terms = [...config.topics, ...config.competitors].map((t) =>
    t.toLowerCase()
  );
  return articles.map((a) => {
    const text = `${a.title} ${a.description}`.toLowerCase();
    const matches = terms.filter((t) => text.includes(t));
    return {
      title: a.title,
      url: a.url,
      source: a.source,
      publishedAt: a.publishedAt,
      urlToImage: a.urlToImage,
      category: "Other",
      importance: Math.min(matches.length || 1, 5),
      summary: a.description || a.title,
      relevant: true,
    };
  });
}
