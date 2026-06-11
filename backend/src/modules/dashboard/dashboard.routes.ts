import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { showDashboard } from "./dashboard.controller";

const router = Router();

router.get("/", authenticate, showDashboard);

export default router;
