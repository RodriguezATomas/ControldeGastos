import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";
import budgetRoutes from "../modules/budgets/budgets.routes";
import categoryRoutes from "../modules/categories/categories.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import expenseRoutes from "../modules/expenses/expenses.routes";
import goalRoutes from "../modules/goals/goals.routes";
import reportRoutes from "../modules/reports/reports.routes";
import userRoutes from "../modules/users/users.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/expenses", expenseRoutes);
router.use("/budgets", budgetRoutes);
router.use("/goals", goalRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);

export default router;
