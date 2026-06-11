// Controlador para manejar las solicitudes relacionadas con los reportes de gastos
import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createExcelReport, createPdfReport } from "./reports.service";

// funcion para descargar el reporte de gastos en formato PDF ----------------------------------------------------------------
export const downloadPdfReport = async (req: AuthRequest, res: Response) => {
  try {
    // genera el reporte en formato PDF utilizando la función createPdfReport y el id del usuario autenticado
    const report = await createPdfReport(req.user!._id.toString());

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=reporte-gastos.pdf");
    res.send(report);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

// funcion para descargar el reporte de gastos en formato Excel ----------------------------------------------------------------
export const downloadExcelReport = async (req: AuthRequest, res: Response) => {
  try {
    // genera el reporte en formato Excel utilizando la función createExcelReport y el id del usuario autenticado
    const report = await createExcelReport(req.user!._id.toString());

    res.setHeader("Content-Type", "application/vnd.ms-excel");
    res.setHeader("Content-Disposition", "attachment; filename=reporte-gastos.xls");
    res.send(report);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
