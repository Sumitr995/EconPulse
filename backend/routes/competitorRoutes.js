import { Router } from "express";
import { addCompetitor, removeCompetitor } from "../controllers/competitorController.js";
import { validateBody } from "../middleware/validateBody.js";

const router = Router();
router.post("/", validateBody(["value"]), addCompetitor);
router.delete("/:value", removeCompetitor);

export default router;
