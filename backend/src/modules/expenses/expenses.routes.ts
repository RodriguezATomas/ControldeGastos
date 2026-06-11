import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { listExpenses, patchExpense, removeExpense, storeExpense } from "./expenses.controller";

const router = Router();

router.get("/", authenticate, listExpenses);
router.post("/", authenticate, storeExpense);
router.patch("/:id", authenticate, patchExpense);
router.delete("/:id", authenticate, removeExpense);

export default router;
