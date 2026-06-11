import { FormEvent, useEffect, useState } from "react";
import { Category, createCategory, deleteCategory, getCategories, updateCategory } from "../api/finance";
import { notify } from "../utils/toast";

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const loadCategories = async () => {
    const data = await getCategories();

    setCategories(data);
  };

  useEffect(() => {
    loadCategories()
      .catch(() => setError("No se pudieron cargar las categorias"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateCategory(editingId, name);
        notify("Categoria actualizada");
      } else {
        await createCategory(name);
        notify("Categoria creada");
      }

      setEditingId("");
      setName("");
      await loadCategories();
    } catch {
      setError("No se pudo guardar la categoria");
      notify("No se pudo guardar la categoria", "error");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id);
    setName(category.name);
  };

  const handleDelete = async (id: string) => {
    setError("");

    try {
      await deleteCategory(id);
      notify("Categoria eliminada");
      await loadCategories();
    } catch {
      setError("No se pudo eliminar la categoria");
      notify("No se pudo eliminar la categoria", "error");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500">Administracion</p>
        <h1 className="text-3xl font-bold text-slate-950">Categorias</h1>
      </div>

      <form className="flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-5 md:flex-row md:items-end" onSubmit={handleSubmit}>
        <label className="block flex-1">
          <span className="mb-1 block text-sm font-medium text-slate-700">Nombre</span>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
        </label>
        <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white">
          {editingId ? "Guardar cambios" : "Crear categoria"}
        </button>
        {editingId && (
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
            onClick={() => {
              setEditingId("");
              setName("");
            }}
            type="button"
          >
            Cancelar
          </button>
        )}
      </form>

      {error && <p className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={2}>
                  Cargando categorias...
                </td>
              </tr>
            )}
            {!loading && categories.length === 0 && (
              <tr>
                <td className="px-4 py-4 text-slate-500" colSpan={2}>
                  No hay categorias cargadas.
                </td>
              </tr>
            )}
            {categories.map((category) => (
              <tr className="border-t border-slate-200" key={category._id}>
                <td className="px-4 py-3 text-slate-900">{category.name}</td>
                <td className="space-x-2 px-4 py-3">
                  <button className="rounded-md border border-slate-300 px-3 py-1 text-slate-700" onClick={() => handleEdit(category)}>
                    Editar
                  </button>
                  <button className="rounded-md border border-red-200 px-3 py-1 text-red-700" onClick={() => handleDelete(category._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
