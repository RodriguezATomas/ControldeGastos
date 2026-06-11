"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadExcelReport = exports.downloadPdfReport = void 0;
const reports_service_1 = require("./reports.service");
const downloadPdfReport = async (req, res) => {
    try {
        const report = await (0, reports_service_1.createPdfReport)(req.user._id.toString());
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-gastos.pdf");
        res.send(report);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.downloadPdfReport = downloadPdfReport;
const downloadExcelReport = async (req, res) => {
    try {
        const report = await (0, reports_service_1.createExcelReport)(req.user._id.toString());
        res.setHeader("Content-Type", "application/vnd.ms-excel");
        res.setHeader("Content-Disposition", "attachment; filename=reporte-gastos.xls");
        res.send(report);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.downloadExcelReport = downloadExcelReport;
