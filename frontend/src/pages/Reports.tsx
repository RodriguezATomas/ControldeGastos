import { useState } from "react";
import { downloadReport } from "../api/finance";
import { notify } from "../utils/toast";

export const Reports = () => {
  const [loading, setLoading] = useState("");

  const handleDownload = async (format: "pdf" | "excel") => {
    setLoading(format);

    try {
      await downloadReport(format);
      notify("Reporte descargado");
    } catch {
      notify("No se pudo descargar el reporte", "error");
    } finally {
      setLoading("");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500">Exportaciones</p>
        <h1 className="text-3xl font-bold text-slate-950">Reportes</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">Reporte PDF</h2>
          <p className="mt-2 text-sm text-slate-600">Descarga el resumen de gastos en PDF.</p>
          <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" disabled={loading === "pdf"} onClick={() => handleDownload("pdf")}>
            {loading === "pdf" ? "Descargando..." : "Descargar PDF"}
          </button>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-slate-950">Reporte Excel</h2>
          <p className="mt-2 text-sm text-slate-600">Descarga el detalle de gastos en Excel.</p>
          <button className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" disabled={loading === "excel"} onClick={() => handleDownload("excel")}>
            {loading === "excel" ? "Descargando..." : "Descargar Excel"}
          </button>
        </article>
      </div>
    </section>
  );
};
