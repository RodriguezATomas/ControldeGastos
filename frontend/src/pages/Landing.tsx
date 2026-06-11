import { useEffect } from "react";
import { useAuthStore } from "../store/auth.store";

type LandingProps = {
  onNavigate: (to: string) => void;
};

export const Landing = ({ onNavigate }: LandingProps) => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      onNavigate("/dashboard");
    }
  }, [onNavigate, user]);

  return (
    <main className="landing-page">
      <header className="landing-header">
        <a className="brand" href="/" onClick={(event) => event.preventDefault()}>
          <span className="brand-icon">▰</span>
          Control de <strong>Gastos</strong>
        </a>
        <nav className="landing-nav">
          <a href="#features">Caracteristicas</a>
          <a href="#benefits">Beneficios</a>
          <a href="#how">Como funciona</a>
          <a href="#prices">Precios</a>
        </nav>
        <div className="landing-actions">
          <a
            className="link-green"
            href="/login"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/login");
            }}
          >
            Ingresar
          </a>
          <a
            className="btn-green"
            href="/register"
            onClick={(event) => {
              event.preventDefault();
              onNavigate("/register");
            }}
          >
            Crear cuenta
          </a>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="hero-pill">Tu dinero. Tus metas. Tu futuro.</p>
          <h1>
            Toma el control de tus <span>finanzas</span>
          </h1>
          <p className="hero-text">
            Controla tus gastos, organiza tu presupuesto, alcanza tus metas y toma mejores decisiones financieras cada dia.
          </p>
          {user ? (
            <p className="session-card">Sesion iniciada como {user.email}</p>
          ) : (
            <div className="hero-buttons">
              <button className="btn-green" onClick={() => onNavigate("/register")}>Comenzar gratis</button>
              <button className="btn-outline" onClick={() => onNavigate("/login")}>Ver como funciona</button>
            </div>
          )}
          <div className="hero-badges">
            <span>✓ Gratis para siempre</span>
            <span>▭ Sin tarjeta de credito</span>
            <span>♢ 100% Seguro</span>
          </div>
        </div>

        <div className="dashboard-preview">
          <aside>
            <div className="mini-brand">▰ Control de <strong>Gastos</strong></div>
            {["Dashboard", "Gastos", "Categorias", "Presupuesto", "Metas", "Reportes", "Calendario"].map((item) => (
              <span className={item === "Dashboard" ? "active" : ""} key={item}>{item}</span>
            ))}
          </aside>
          <section>
            <div className="preview-top">
              <h2>Dashboard</h2>
              <button>Junio 2024</button>
            </div>
            <div className="preview-kpis">
              <article><small>Gasto total</small><strong>$425.000</strong><em>▲ 8.5% vs mayo</em></article>
              <article><small>Presupuesto</small><strong>$800.000</strong><em>▲ 15% disponible</em></article>
              <article><small>Ahorros</small><strong>$375.000</strong><em>▲ 12.5% vs mayo</em></article>
            </div>
            <div className="preview-grid">
              <div className="donut" />
              <div className="line-chart"><span /></div>
            </div>
            <div className="preview-table">
              <p><span>Supermercado</span><strong>-$45.000</strong></p>
              <p><span>Uber</span><strong>-$12.500</strong></p>
              <p><span>Netflix</span><strong>-$16.900</strong></p>
            </div>
          </section>
        </div>
      </section>

      <section className="features" id="features">
        <p>CARACTERISTICAS</p>
        <h2>Todo lo que necesitas para gestionar tu dinero</h2>
        <div>
          {["Control de Gastos", "Presupuestos", "Metas Financieras", "Reportes y Graficos", "Calendario", "Seguro y Privado"].map((item) => (
            <article key={item}>
              <span>▣</span>
              <strong>{item}</strong>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
