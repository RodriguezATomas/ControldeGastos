// Rutas para manejar las solicitudes relacionadas con los objetivos de ahorro
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { listGoals, patchGoal, removeGoal, storeGoal } from "./goals.controller";

const router = Router();

// Define las rutas de objetivos de ahorro y asociarlas con sus controladores correspondientes
router.get("/", authenticate, listGoals);
router.post("/", authenticate, storeGoal);
router.patch("/:id", authenticate, patchGoal);
router.delete("/:id", authenticate, removeGoal);

export default router;
