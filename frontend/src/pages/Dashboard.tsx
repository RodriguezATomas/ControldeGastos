import { useEffect, useState } from "react";
import { DashboardData, getDashboard } from "../api/finance";

const currency = new Intl.NumberFormat("es-AR", {
  currency: "ARS",
  style: "currency"
});

const currentMonth = new Date().toISOString().slice(0, 7);

export const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(currentMonth);

  useEffect(() => {
    setLoading(true);
    getDashboard(month)
      .then(setDashboard)
      .catch(() => setError("No se pudo cargar el dashboard"))
      .finally(() => setLoading(false));
  }, [month]);

  if (loading) {
    return <p className="text-slate-600">Cargando dashboard...</p>;
  }

  if (error || !dashboard) {
    return <p className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>;
  }

  const maxCategory = Math.max(...dashboard.gastosPorCategoria.map((item) => item.total), 1);
  const maxMonth = Math.max(...dashboard.evolucionMensual.map((item) => item.total), 1);

  return (
    <section className="space-y-6">
      <div className="dashboard-header">
        <div>
          <p className="text-sm font-semibold uppercase text-slate-500">Resumen</p>
          <h1 className="text-3xl font-bold text-slate-950">Dashboard</h1>
        </div>
        <input
          className="dashboard-month-selector rounded-md border border-slate-300 px-3 py-2"
          onChange={(event) => setMonth(event.target.value)}
          type="month"
          value={month}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Total gastado</p>
          <strong className="mt-2 block text-2xl text-slate-950">{currency.format(dashboard.totalGastado)}</strong>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Gasto promedio</p>
          <strong className="mt-2 block text-2xl text-slate-950">{currency.format(dashboard.gastoPromedio)}</strong>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Mayor gasto</p>
          <strong className="mt-2 block text-2xl text-slate-950">{currency.format(dashboard.mayorGasto)}</strong>
        </article>
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Presupuesto disponible</p>
          <strong className="mt-2 block text-2xl text-slate-950">{currency.format(dashboard.presupuestoDisponible)}</strong>
          <p className="mt-2 text-sm text-slate-500">{Math.min(dashboard.presupuestoUsado, 100).toFixed(0)}% utilizado</p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Gastos por categoria</h2>
          <div className="space-y-3">
            {dashboard.gastosPorCategoria.length === 0 && <p className="text-sm text-slate-500">Sin datos</p>}
            {dashboard.gastosPorCategoria.map((item) => (
              <div key={item._id}>
                <div className="mb-1 flex justify-between text-sm text-slate-600">
                  <span>{item.categoria}</span>
                  <span>{currency.format(item.total)}</span>
                </div>
                <div className="h-3 rounded-md bg-slate-100">
                  <div className="h-3 rounded-md bg-slate-900" style={{ width: `${(item.total / maxCategory) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-md border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">Evolucion mensual</h2>
          <div className="flex h-56 items-end gap-3 border-b border-slate-200 pb-2">
            {dashboard.evolucionMensual.length === 0 && <p className="self-start text-sm text-slate-500">Sin datos</p>}
            {dashboard.evolucionMensual.map((item) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={`${item.year}-${item.month}`}>
                <div
                  className="w-full rounded-t-md bg-slate-900"
                  style={{ height: `${Math.max((item.total / maxMonth) * 100, 5)}%` }}
                  title={currency.format(item.total)}
                />
                <span className="text-xs text-slate-500">
                  {item.month}/{String(item.year).slice(2)}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
};
