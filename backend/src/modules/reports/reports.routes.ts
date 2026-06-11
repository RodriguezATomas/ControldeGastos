import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { downloadExcelReport, downloadPdfReport } from "./reports.controller";

const router = Router();

router.get("/pdf", authenticate, downloadPdfReport);
router.get("/excel", authenticate, downloadExcelReport);

export default router;
