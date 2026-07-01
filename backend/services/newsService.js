import { getConfig } from "../src/configStore.js";
import { fetchArticles } from "../src/newsFetcher.js";

export async function runNewsPipeline() {
  const config = getConfig();
  const articles = await fetchArticles(config);
  return articles;
}
