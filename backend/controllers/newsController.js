import { runNewsPipeline } from "../services/newsService.js";

export async function getNews(req, res, next) {
  try {
    const queryOverride = req.query.q || "";
    const articles = await runNewsPipeline(queryOverride);
    res.json(articles);
  } catch (err) {
    next(err);
  }
}
