import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

type AppLayoutProps = {
  children: ReactNode;
  currentPath: string;
  onNavigate: (to: string) => void;
};

export const AppLayout = ({ children, currentPath, onNavigate }: AppLayoutProps) => {
  return (
    <div className="app-shell">
      <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="app-main">{children}</main>
    </div>
  );
};
