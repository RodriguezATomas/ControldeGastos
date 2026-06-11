import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createExcelReport, createPdfReport } from "./reports.service";

export const downloadPdfReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await createPdfReport(req.user!._id.toString());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reporte-gastos.pdf");
    res.send(report);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const downloadExcelReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await createExcelReport(req.user!._id.toString());

    res.setHeader("Content-Type", "application/vnd.ms-excel");
    res.setHeader("Content-Disposition", "attachment; filename=reporte-gastos.xls");
    res.send(report);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
