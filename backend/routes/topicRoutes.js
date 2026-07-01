import { Router } from "express";
import { addTopic, removeTopic } from "../controllers/topicController.js";
import { validateBody } from "../middleware/validateBody.js";

const router = Router();
router.post("/", validateBody(["value"]), addTopic);
router.delete("/:value", removeTopic);

export default router;
