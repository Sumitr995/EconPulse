import { Router } from "express";
import configRoutes from "./configRoutes.js";
import topicRoutes from "./topicRoutes.js";
import sourceRoutes from "./sourceRoutes.js";
import competitorRoutes from "./competitorRoutes.js";
import newsRoutes from "./newsRoutes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.send("Hello from EconPulse!");
});

router.use("/config", configRoutes);
router.use("/topics", topicRoutes);
router.use("/sources", sourceRoutes);
router.use("/competitors", competitorRoutes);
router.use("/news", newsRoutes);

export default router;
