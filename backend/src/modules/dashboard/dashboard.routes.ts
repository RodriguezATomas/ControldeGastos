// rutas para el panel de control
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { showDashboard } from "./dashboard.controller";

const router = Router();

// Define las rutas del panel de control y asociarlas con sus controladores correspondientes
router.get("/", authenticate, showDashboard);

export default router;
