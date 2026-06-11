import { useAuthStore } from "../../store/auth.store";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/expenses", label: "Gastos" },
  { to: "/categories", label: "Categorias" },
  { to: "/budgets", label: "Presupuesto" },
  { to: "/goals", label: "Metas" },
  { to: "/reports", label: "Reportes" },
  { to: "/calendar", label: "Calendario" },
  { to: "/settings", label: "Configuracion" }
];

type SidebarProps = {
  currentPath: string;
  onNavigate: (to: string) => void;
};

export const Sidebar = ({ currentPath, onNavigate }: SidebarProps) => {
  const { logout, user } = useAuthStore();

  return (
    <aside className="sidebar">
      <a className="sidebar-brand" href="/dashboard" onClick={(event) => { event.preventDefault(); onNavigate("/dashboard"); }}>
        <span className="brand-icon">▰</span>
        Mis Gastos
      </a>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <a
            className={currentPath === link.to ? "active" : ""}
            href={link.to}
            key={link.to}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(link.to);
            }}
          >
            <span className="nav-icon">▣</span>
            {link.label}
          </a>
        ))}
      </nav>
      <div className="sidebar-user">
        <div>
          <strong>{user?.name || "Usuario"}</strong>
          <span>{user?.email || "Sin email"}</span>
        </div>
        <button
          onClick={() => {
            logout();
            onNavigate("/");
          }}
        >
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
};
