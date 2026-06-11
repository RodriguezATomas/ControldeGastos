import { useAuthStore } from "../store/auth.store";
import { notify } from "../utils/toast";

type SettingsProps = {
  onNavigate: (to: string) => void;
};

export const Settings = ({ onNavigate }: SettingsProps) => {
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    notify("Sesion cerrada");
    onNavigate("/login");
  };

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase text-slate-500">Cuenta</p>
        <h1 className="text-3xl font-bold text-slate-950">Configuracion</h1>
      </div>

      <article className="rounded-md border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-950">Perfil</h2>
        <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
          <p><strong>Nombre:</strong> {user?.name || "Sin sesion"}</p>
          <p><strong>Email:</strong> {user?.email || "Sin sesion"}</p>
          <p><strong>Rol:</strong> {user?.role || "Sin sesion"}</p>
          <p><strong>Email verificado:</strong> {user?.isEmailVerified ? "Si" : "No"}</p>
        </div>
        <button className="mt-5 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" onClick={handleLogout}>
          Cerrar sesion
        </button>
      </article>
    </section>
  );
};
