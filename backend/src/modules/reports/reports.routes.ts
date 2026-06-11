// Rutas para manejar las solicitudes relacionadas con los reportes de gastos
import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { downloadExcelReport, downloadPdfReport } from "./reports.controller";

const router = Router();

// Define las rutas de reportes y asociarlas con sus controladores correspondientes
router.get("/pdf", authenticate, downloadPdfReport);
router.get("/excel", authenticate, downloadExcelReport);

export default router;
