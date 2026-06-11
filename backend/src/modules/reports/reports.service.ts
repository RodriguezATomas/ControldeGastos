// Servicio para generar reportes de gastos en formato PDF y Excel
import { Expense, IExpense } from "../../models/expense.model";

type ExpenseWithCategory = IExpense & {
  category: {
    name?: string;
  };
};

// función para formatear la fecha en formato YYYY-MM-DD----------------------------------------------------------------
const formatDate = (date: Date) => date.toISOString().split("T")[0];

// función para escapar caracteres especiales en HTML para evitar problemas de formato en el reporte Excel ----------------------------------------------------------------
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// función para escapar caracteres especiales en PDF para evitar problemas de formato en el reporte PDF ----------------------------------------------------------------
const escapePdf = (value: string) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

// función para obtener los gastos de un usuario y sus categorías para generar los reportes ----------------------------------------------------------------
const getReportExpenses = async (userId: string) => {
  return Expense.find({ user: userId }).populate("category").sort({ date: -1 });
};

// función para construir el contenido del PDF a partir de las líneas de texto y generar el archivo PDF ----------------------------------------------------------------
const buildPdf = (lines: string[]) => {
  const content = [
    "BT",
    "/F1 12 Tf",
    "50 780 Td",
    ...lines.map((line, index) => `${index === 0 ? "" : "0 -18 Td"}(${escapePdf(line)}) Tj`),
    "ET"
  ].join("\n");

  // construye el PDF manualmente utilizando la especificación PDF básica, creando los objetos necesarios para el catálogo, las páginas, la fuente y el contenido del PDF
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`
  ];

  // construye el PDF concatenando los objetos y creando la tabla de referencias cruzadas (xref) para que el PDF sea legible por los lectores de PDF
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  // construye la tabla de referencias cruzadas (xref) para que el PDF sea legible por los lectores de PDF, indicando la posición de cada objeto en el archivo PDF
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.slice(1).map((offset) => `${offset.toString().padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf);
};

// función para generar el reporte de gastos en formato PDF ----------------------------------------------------------------
export const createPdfReport = async (userId: string) => {
  // obtiene los gastos del usuario junto con sus categorías utilizando la función getReportExpenses, calcula el total gastado y construye las líneas de texto para el reporte PDF, formateando la fecha, la descripción, la categoría y el monto de cada gasto, y luego genera el archivo PDF utilizando la función buildPdf
  const expenses = (await getReportExpenses(userId)) as ExpenseWithCategory[];
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lines = [
    "Reporte de gastos",
    `Total gastado: ${total}`,
    "",
    ...expenses.slice(0, 35).map((expense) =>
      `${formatDate(expense.date)} - ${expense.description} - ${expense.category?.name || "Sin categoria"} - ${expense.amount}`
    )
  ];

  return buildPdf(lines);
};

// función para generar el reporte de gastos en formato Excel ----------------------------------------------------------------
export const createExcelReport = async (userId: string) => {
  // obtiene los gastos del usuario junto con sus categorías utilizando la función getReportExpenses, construye las filas de la tabla para el reporte Excel, formateando la fecha, la descripción, la categoría y el monto de cada gasto, y luego genera el contenido HTML para el archivo Excel utilizando las filas construidas
  const expenses = (await getReportExpenses(userId)) as ExpenseWithCategory[];
  const rows = expenses
    .map(
      (expense) =>
        `<tr><td>${formatDate(expense.date)}</td><td>${escapeHtml(expense.description)}</td><td>${escapeHtml(
          expense.category?.name || "Sin categoria"
        )}</td><td>${expense.amount}</td></tr>`
    )
    .join("");

  return `<html><body><table><thead><tr><th>Fecha</th><th>Descripcion</th><th>Categoria</th><th>Monto</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
};
