import { getConfig } from "../src/configStore.js";
import { fetchArticles } from "../src/newsFetcher.js";
import { filterArticles } from "../src/aiFilter.js";

export async function runNewsPipeline(queryOverride = "") {
  const config = getConfig();
  const articles = await fetchArticles(config, queryOverride);
  const filtered = await filterArticles(articles, config);
  return filtered
    .filter((a) => a.relevant !== false)
    .sort((a, b) => b.importance - a.importance || new Date(b.publishedAt) - new Date(a.publishedAt));
}
