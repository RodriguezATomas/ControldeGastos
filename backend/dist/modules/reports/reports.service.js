"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExcelReport = exports.createPdfReport = void 0;
const expense_model_1 = require("../../models/expense.model");
const formatDate = (date) => date.toISOString().split("T")[0];
const escapeHtml = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
const escapePdf = (value) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const getReportExpenses = async (userId) => {
    return expense_model_1.Expense.find({ user: userId }).populate("category").sort({ date: -1 });
};
const buildPdf = (lines) => {
    const content = [
        "BT",
        "/F1 12 Tf",
        "50 780 Td",
        ...lines.map((line, index) => `${index === 0 ? "" : "0 -18 Td"}(${escapePdf(line)}) Tj`),
        "ET"
    ].join("\n");
    const objects = [
        "<< /Type /Catalog /Pages 2 0 R >>",
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
        `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`
    ];
    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objects.forEach((object, index) => {
        offsets.push(Buffer.byteLength(pdf));
        pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });
    const xrefOffset = Buffer.byteLength(pdf);
    pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    pdf += offsets.slice(1).map((offset) => `${offset.toString().padStart(10, "0")} 00000 n \n`).join("");
    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
    return Buffer.from(pdf);
};
const createPdfReport = async (userId) => {
    const expenses = (await getReportExpenses(userId));
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const lines = [
        "Reporte de gastos",
        `Total gastado: ${total}`,
        "",
        ...expenses.slice(0, 35).map((expense) => `${formatDate(expense.date)} - ${expense.description} - ${expense.category?.name || "Sin categoria"} - ${expense.amount}`)
    ];
    return buildPdf(lines);
};
exports.createPdfReport = createPdfReport;
const createExcelReport = async (userId) => {
    const expenses = (await getReportExpenses(userId));
    const rows = expenses
        .map((expense) => `<tr><td>${formatDate(expense.date)}</td><td>${escapeHtml(expense.description)}</td><td>${escapeHtml(expense.category?.name || "Sin categoria")}</td><td>${expense.amount}</td></tr>`)
        .join("");
    return `<html><body><table><thead><tr><th>Fecha</th><th>Descripcion</th><th>Categoria</th><th>Monto</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
};
exports.createExcelReport = createExcelReport;
