// rutas para manejar las solicitudes relacionadas con las categorías
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { listCategories, patchCategory, removeCategory, storeCategory } from "./categories.controller";

const router = Router();

// Define las rutas de categorías y asociarlas con sus controladores correspondientes
router.get("/", authenticate, listCategories);
router.post("/", authenticate, storeCategory);
router.patch("/:id", authenticate, patchCategory);
router.delete("/:id", authenticate, removeCategory);

export default router;
