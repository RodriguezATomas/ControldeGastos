import { FormEvent, useState } from "react";
import { useAuthStore } from "../store/auth.store";

type RegisterProps = {
  onNavigate: (to: string) => void;
};

export const Register = ({ onNavigate }: RegisterProps) => {
  const { error, loading, register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await register(name, email, password);
    onNavigate("/dashboard");
  };

  return (
    <section className="auth-page">
      <aside className="auth-side">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <span className="brand-icon">▰</span>
          Control de <strong>Gastos</strong>
        </a>
        <div className="auth-points">
          <p><span>⚙</span><strong>Seguridad</strong><br />Tus datos siempre protegidos</p>
          <p><span>▣</span><strong>Sincronizacion</strong><br />Accede desde cualquier dispositivo</p>
          <p><span>▥</span><strong>Reportes</strong><br />Visualiza tu progreso con graficos</p>
          <p><span>◎</span><strong>Metas</strong><br />Alcanza tus objetivos financieros</p>
        </div>
      </aside>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Crear cuenta</h1>
        <p>Es rapido y facil. Completa tus datos para comenzar</p>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Nombre completo</span>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Ingresa tu nombre completo"
            onChange={(event) => setName(event.target.value)}
            value={name}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Ingresa tu correo electronico"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Contrasena</span>
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Crea una contrasena"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white" disabled={loading}>
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
        <p className="auth-switch">¿Ya tienes una cuenta? <button type="button" onClick={() => onNavigate("/login")}>Iniciar sesion</button></p>
      </form>
    </section>
  );
};
