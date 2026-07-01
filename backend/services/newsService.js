import { getConfig } from "../src/configStore.js";
import { fetchArticles } from "../src/newsFetcher.js";

export async function runNewsPipeline(queryOverride = "") {
  const config = getConfig();
  const articles = await fetchArticles(config, queryOverride);
  return articles;
}
