import { Router } from "express";
import { addSource, removeSource } from "../controllers/sourceController.js";
import { validateBody } from "../middleware/validateBody.js";

const router = Router();
router.post("/", validateBody(["value"]), addSource);
router.delete("/:value", removeSource);

export default router;
