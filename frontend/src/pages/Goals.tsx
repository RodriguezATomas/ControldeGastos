import { FormEvent, useEffect, useState } from "react";
import { Goal, GoalPayload, createGoal, deleteGoal, getGoals, updateGoal } from "../api/finance";
import { notify } from "../utils/toast";

const currency = new Intl.NumberFormat("es-AR", {
  currency: "ARS",
  style: "currency"
});

const emptyForm = {
  currentAmount: "0",
  deadline: "",
  name: "",
  targetAmount: ""
};

export const Goals = () => {
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingAmounts, setSavingAmounts] = useState<Record<string, string>>({});

  const loadGoals = async () => {
    const data = await getGoals();

    setGoals(data);
  };

  useEffect(() => {
    loadGoals()
      .catch(() => setError("No se pudieron cargar las metas"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const payload: GoalPayload = {
      currentAmount: Number(form.currentAmount),
      deadline: form.deadline,
      name: form.name,
      targetAmount: Number(form.targetAmount)
    };

    try {
      if (editingId) {
        await updateGoal(editingId, payload);
        notify("Meta actualizada");
      } else {
        await createGoal(payload);
        notify("Meta creada");
      }

      setEditingId("");
      setForm(emptyForm);
      await loadGoals();
    } catch {
      setError("No se pudo guardar la meta");
      notify("No se pudo guardar la meta", "error");
    }
  };

  const handleEdit = (goal: Goal) => {
    setEditingId(goal._id);
    setForm({
      currentAmount: String(goal.currentAmount || 0),
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : "",
      name: goal.name,
      targetAmount: String(goal.targetAmount)
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGoal(id);
      notify("Meta eliminada");
      await loadGoals();
    } catch {
      setError("No se pudo eliminar la meta");
      notify("No se pudo eliminar la meta", "error");
    }
  };

  const handleAddSaving = async (goal: Goal) => {
    const amount = Number(savingAmounts[goal._id] || 0);

    if (amount <= 0) {
      return;
    }

    try {
      await updateGoal(goal._id, {
        currentAmount: (goal.currentAmount || 0) + amount,
        deadline: goal.deadline ? goal.deadline.slice(0, 10) : "",
        name: goal.name,
        targetAmount: goal.targetAmount
      });
      setSavingAmounts({ ...savingAmounts, [goal._id]: "" });
      notify("Ahorro agregado");
      await loadGoals();
    } catch {
      setError("No se pudo agregar el ahorro");
      notify("No se pudo agregar el ahorro", "error");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500">Objetivos</p>
        <h1 className="text-3xl font-bold text-slate-950">Metas</h1>
      </div>

      <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 md:grid-cols-5" onSubmit={handleSubmit}>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">Nombre</span>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" onChange={(event) => setForm({ ...form, name: event.target.value })} required value={form.name} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Objetivo</span>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" min="0" onChange={(event) => setForm({ ...form, targetAmount: event.target.value })} required type="number" value={form.targetAmount} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Actual</span>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" min="0" onChange={(event) => setForm({ ...form, currentAmount: event.target.value })} required type="number" value={form.currentAmount} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Fecha limite</span>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2" onChange={(event) => setForm({ ...form, deadline: event.target.value })} type="date" value={form.deadline} />
        </label>
        <div className="flex gap-2 md:col-span-5">
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">{editingId ? "Guardar cambios" : "Crear meta"}</button>
          {editingId && <button className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700" onClick={() => { setEditingId(""); setForm(emptyForm); }} type="button">Cancelar</button>}
        </div>
      </form>

      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {loading && <p className="text-slate-600">Cargando metas...</p>}
        {!loading && goals.length === 0 && <p className="text-slate-600">No hay metas cargadas.</p>}
        {goals.map((goal) => {
          const progress = Math.min(((goal.currentAmount || 0) / goal.targetAmount) * 100, 100);

          return (
            <article className="rounded-md border border-slate-200 bg-white p-5" key={goal._id}>
              <div className="flex justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-950">{goal.name}</h2>
                  <p className="text-sm text-slate-500">{goal.deadline ? new Date(goal.deadline).toLocaleDateString("es-AR") : "Sin fecha"}</p>
                </div>
                <strong className="text-slate-950">{currency.format(goal.currentAmount || 0)} / {currency.format(goal.targetAmount)}</strong>
              </div>
              <div className="mt-4 h-3 rounded-md bg-slate-100">
                <div className="h-3 rounded-md bg-slate-900" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <input
                  className="w-32 rounded-md border border-slate-300 px-3 py-1 text-sm"
                  min="0"
                  onChange={(event) => setSavingAmounts({ ...savingAmounts, [goal._id]: event.target.value })}
                  placeholder="Ahorro"
                  type="number"
                  value={savingAmounts[goal._id] || ""}
                />
                <button className="rounded-md border border-green-200 px-3 py-1 text-sm text-green-700" onClick={() => handleAddSaving(goal)}>+</button>
                <button className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700" onClick={() => handleEdit(goal)}>Editar</button>
                <button className="rounded-md border border-red-200 px-3 py-1 text-sm text-red-700" onClick={() => handleDelete(goal._id)}>Eliminar</button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
