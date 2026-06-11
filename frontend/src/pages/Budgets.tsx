import { FormEvent, useEffect, useState } from "react";
import { Budget, BudgetPayload, createBudget, getBudgets, updateBudget } from "../api/finance";
import { notify } from "../utils/toast";

const currency = new Intl.NumberFormat("es-AR", {
  currency: "ARS",
  style: "currency"
});

const emptyForm = {
  amount: "",
  month: String(new Date().getMonth() + 1),
  year: String(new Date().getFullYear())
};

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];

export const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const loadBudgets = async () => {
    const data = await getBudgets();

    setBudgets(data);
  };

  useEffect(() => {
    loadBudgets()
      .catch(() => setError("No se pudieron cargar los presupuestos"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const payload: BudgetPayload = {
      amount: Number(form.amount),
      month: Number(form.month),
      year: Number(form.year)
    };

    try {
      if (editingId) {
        await updateBudget(editingId, payload);
        notify("Presupuesto actualizado");
      } else {
        await createBudget(payload);
        notify("Presupuesto creado");
      }

      setEditingId("");
      setForm(emptyForm);
      await loadBudgets();
    } catch {
      setError("No se pudo guardar el presupuesto");
      notify("No se pudo guardar el presupuesto", "error");
    }
  };

  const handleEdit = (budget: Budget) => {
    setEditingId(budget._id);
    setForm({ amount: String(budget.amount), month: String(budget.month), year: String(budget.year) });
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500">Planificacion</p>
        <h1 className="text-3xl font-bold text-slate-950">Presupuesto</h1>
      </div>

      <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 md:grid-cols-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Monto</span>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" min="0" onChange={(event) => setForm({ ...form, amount: event.target.value })} required type="number" value={form.amount} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Mes</span>
          <select className="w-full rounded-md border border-slate-300 px-3 py-2" onChange={(event) => setForm({ ...form, month: event.target.value })} required value={form.month}>
            {monthNames.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Año</span>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" min="2000" onChange={(event) => setForm({ ...form, year: event.target.value })} required type="number" value={form.year} />
        </label>
        <div className="flex items-end gap-2">
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">{editingId ? "Guardar cambios" : "Crear presupuesto"}</button>
          {editingId && <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700" onClick={() => { setEditingId(""); setForm(emptyForm); }} type="button">Cancelar</button>}
        </div>
      </form>

      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-3">
        {loading && <p className="text-slate-600">Cargando presupuestos...</p>}
        {!loading && budgets.length === 0 && <p className="text-slate-600">No hay presupuestos cargados.</p>}
        {budgets.map((budget) => (
          <article className="rounded-md border border-slate-200 bg-white p-5" key={budget._id}>
            <p className="text-sm text-slate-500">{monthNames[budget.month - 1]} {budget.year}</p>
            <strong className="mt-2 block text-2xl text-slate-950">{currency.format(budget.amount)}</strong>
            <button className="mt-4 rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700" onClick={() => handleEdit(budget)}>Editar</button>
          </article>
        ))}
      </div>
    </section>
  );
};
