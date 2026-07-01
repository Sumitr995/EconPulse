import { getConfig } from "../src/configStore.js";
import { fetchArticles } from "../src/newsFetcher.js";
import { filterArticles } from "../src/aiFilter.js";

export async function runNewsPipeline() {
  const config = getConfig();
  const articles = await fetchArticles(config);
  const classified = await filterArticles(articles, config);
  return classified
    .filter((a) => a.relevant !== false)
    .sort((a, b) => b.importance - a.importance || new Date(b.publishedAt) - new Date(a.publishedAt));
}
