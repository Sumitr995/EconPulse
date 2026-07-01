import { Router } from "express";
import { getNews } from "../controllers/newsController.js";

const router = Router();
router.get("/run", getNews);

export default router;
