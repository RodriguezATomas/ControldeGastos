import { FormEvent, useEffect, useState } from "react";
import {
  Category,
  Expense,
  ExpensePayload,
  createExpense,
  deleteExpense,
  getCategories,
  getExpenses,
  updateExpense
} from "../api/finance";
import { notify } from "../utils/toast";

const currency = new Intl.NumberFormat("es-AR", {
  currency: "ARS",
  style: "currency"
});

const emptyForm = {
  amount: "",
  category: "",
  date: new Date().toISOString().slice(0, 10),
  description: "",
  paymentMethod: ""
};

const categoryStyles: Record<string, { color: string; icon: string }> = {
  alimentacion: { color: "green", icon: "▰" },
  comida: { color: "green", icon: "▰" },
  transporte: { color: "blue", icon: "▣" },
  servicios: { color: "yellow", icon: "◌" },
  entretenimiento: { color: "purple", icon: "▱" },
  salud: { color: "red", icon: "✚" },
  hogar: { color: "cyan", icon: "⌂" },
  compras: { color: "orange", icon: "▢" },
  educacion: { color: "indigo", icon: "△" },
  otros: { color: "gray", icon: "•••" }
};

const paymentMethods = ["Tarjeta de Debito", "Tarjeta de Credito", "Efectivo", "Transferencia", "Debito Automatico"];

const normalize = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const getCategoryName = (expense: Expense) => {
  if (!expense.category) {
    return "Sin categoria";
  }

  return typeof expense.category === "string" ? expense.category : expense.category.name;
};

const getCategoryStyle = (name: string) => {
  return categoryStyles[normalize(name)] || categoryStyles.otros;
};

const toForm = (expense: Expense) => ({
  amount: String(expense.amount),
  category: typeof expense.category === "string" ? expense.category : expense.category?._id || "",
  date: expense.date.slice(0, 10),
  description: expense.description,
  paymentMethod: expense.paymentMethod || ""
});

export const Expenses = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const [expensesData, categoriesData] = await Promise.all([getExpenses(), getCategories()]);

    setExpenses(expensesData);
    setCategories(categoriesData);
  };

  useEffect(() => {
    loadData()
      .catch(() => setError("No se pudieron cargar los gastos"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const payload: ExpensePayload = {
      amount: Number(form.amount),
      category: form.category,
      date: form.date,
      description: form.description,
      paymentMethod: form.paymentMethod
    };

    try {
      if (editingId) {
        await updateExpense(editingId, payload);
        notify("Gasto actualizado");
      } else {
        await createExpense(payload);
        notify("Gasto creado");
      }

      setEditingId("");
      setForm(emptyForm);
      await loadData();
    } catch {
      setError("No se pudo guardar el gasto");
      notify("No se pudo guardar el gasto", "error");
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingId(expense._id);
    setForm(toForm(expense));
  };

  const handleDelete = async (id: string) => {
    setError("");

    try {
      await deleteExpense(id);
      notify("Gasto eliminado");
      await loadData();
    } catch {
      setError("No se pudo eliminar el gasto");
      notify("No se pudo eliminar el gasto", "error");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500">Movimientos</p>
        <h1 className="text-3xl font-bold text-slate-950">Gastos</h1>
      </div>

      <form className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 md:grid-cols-5" onSubmit={handleSubmit}>
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm font-medium text-slate-700">Descripcion</span>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            required
            value={form.description}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Monto</span>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            min="0"
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
            required
            type="number"
            value={form.amount}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Fecha</span>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            onChange={(event) => setForm({ ...form, date: event.target.value })}
            required
            type="date"
            value={form.date}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Categoria</span>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            required
            value={form.category}
          >
            <option value="">Seleccionar</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Metodo de pago</span>
          <select
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })}
            required
            value={form.paymentMethod}
          >
            <option value="">Seleccionar</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-2 md:col-span-5">
          <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            {editingId ? "Guardar cambios" : "Crear gasto"}
          </button>
          {editingId && (
            <button
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
              onClick={() => {
                setEditingId("");
                setForm(emptyForm);
              }}
              type="button"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Descripcion</th>
              <th className="px-4 py-3 font-medium">Categoria</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Monto</th>
              <th className="px-4 py-3 font-medium">Metodo de pago</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  Cargando gastos...
                </td>
              </tr>
            )}
            {!loading && expenses.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={6}>
                  No hay gastos cargados.
                </td>
              </tr>
            )}
            {expenses.map((expense) => {
              const categoryName = getCategoryName(expense);
              const categoryStyle = getCategoryStyle(categoryName);

              return (
              <tr className="border-t border-slate-200" key={expense._id}>
                <td className="px-4 py-3 text-slate-900">
                  {expense.description}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  <span className={`category-badge category-badge-${categoryStyle.color}`}>{categoryName}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{new Date(expense.date).toLocaleDateString("es-AR")}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{currency.format(expense.amount)}</td>
                <td className="px-4 py-3 text-slate-600">{expense.paymentMethod || "No informado"}</td>
                <td className="space-x-2 px-4 py-3">
                  <button className="rounded-md border border-slate-300 px-3 py-1 text-slate-700" onClick={() => handleEdit(expense)}>
                    Editar
                  </button>
                  <button className="rounded-md border border-red-200 px-3 py-1 text-red-700" onClick={() => handleDelete(expense._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
