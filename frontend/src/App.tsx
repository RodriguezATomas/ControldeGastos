import { useEffect, useState } from "react";
import { ToastNotifications } from "./components/ToastNotifications";
import { AppLayout } from "./components/layout/AppLayout";
import { Budgets } from "./pages/Budgets";
import { Calendar } from "./pages/Calendar";
import { Categories } from "./pages/Categories";
import { Dashboard } from "./pages/Dashboard";
import { Expenses } from "./pages/Expenses";
import { Goals } from "./pages/Goals";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Reports } from "./pages/Reports";
import { Register } from "./pages/Register";
import { Settings } from "./pages/Settings";

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setPath(to);
  };

  const page = {
    "/": <Landing onNavigate={navigate} />,
    "/dashboard": <Dashboard />,
    "/expenses": <Expenses />,
    "/categories": <Categories />,
    "/budgets": <Budgets />,
    "/goals": <Goals />,
    "/reports": <Reports />,
    "/calendar": <Calendar />,
    "/settings": <Settings onNavigate={navigate} />,
    "/login": <Login onNavigate={navigate} />,
    "/register": <Register onNavigate={navigate} />
  }[path] || <Landing onNavigate={navigate} />;

  if (path === "/" || path === "/login" || path === "/register") {
    return (
      <>
        {page}
        <ToastNotifications />
      </>
    );
  }

  return (
    <AppLayout currentPath={path} onNavigate={navigate}>
      {page}
      <ToastNotifications />
    </AppLayout>
  );
}

export default App;
