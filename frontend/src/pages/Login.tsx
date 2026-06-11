import { FormEvent, useState } from "react";
import { useAuthStore } from "../store/auth.store";

type LoginProps = {
  onNavigate: (to: string) => void;
};

export const Login = ({ onNavigate }: LoginProps) => {
  const { error, loading, login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await login(email, password);
    onNavigate("/dashboard");
  };

  return (
    <section className="auth-page">
      <aside className="auth-side">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); onNavigate("/"); }}>
          <span className="brand-icon">▰</span>
          Control de <strong>Gastos</strong>
        </a>
        <div className="wallet-art">▰</div>
        <ul>
          <li>▣ Organiza tus gastos</li>
          <li>◴ Controla tu presupuesto</li>
          <li>⌁ Alcanza tus metas</li>
          <li>♢ Toma el control de tus finanzas</li>
        </ul>
        <p>¿Necesitas ayuda?<br />Visita nuestro centro de ayuda ↗</p>
      </aside>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Iniciar sesion</h1>
        <p>Bienvenido de nuevo. Ingresa tus credenciales para continuar</p>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Correo electronico</span>
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
            placeholder="Ingresa tu contrasena"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white" disabled={loading}>
          {loading ? "Ingresando..." : "Iniciar sesion"}
        </button>
        <p className="auth-switch">¿No tienes una cuenta? <button type="button" onClick={() => onNavigate("/register")}>Registrate</button></p>
      </form>
    </section>
  );
};
