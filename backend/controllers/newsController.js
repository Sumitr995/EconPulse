import { runNewsPipeline } from "../services/newsService.js";

export async function getNews(_req, res, next) {
  try {
    const articles = await runNewsPipeline();
    res.json(articles);
  } catch (err) {
    next(err);
  }
}
