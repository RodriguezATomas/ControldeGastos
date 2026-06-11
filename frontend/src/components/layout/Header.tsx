import { useAuthStore } from "../../store/auth.store";

type HeaderProps = {
  onNavigate: (to: string) => void;
};

export const Header = ({ onNavigate }: HeaderProps) => {
  const { user, logout } = useAuthStore();

  const handleNavigate = (to: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(to);
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <a href="/" onClick={handleNavigate("/")} className="text-lg font-semibold text-slate-900">
        Control de Gastos
      </a>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-slate-600">{user.name}</span>
            <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <a className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/login" onClick={handleNavigate("/login")}>
            Ingresar
          </a>
        )}
      </div>
    </header>
  );
};
