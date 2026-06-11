import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { listBudgets, patchBudget, storeBudget } from "./budgets.controller";

const router = Router();

router.get("/", authenticate, listBudgets);
router.post("/", authenticate, storeBudget);
router.patch("/:id", authenticate, patchBudget);

export default router;
