import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const nav = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/transacoes", label: "Transações" },
  { path: "/categorias", label: "Categorias" },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const { user } = useAuth();
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "?";

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/dashboard" className="flex items-center flex-shrink-0">
              <img src="/Logo.svg" alt="FINANCY" className="h-6 w-auto" />
            </Link>
            <nav className="flex-1 flex items-center justify-center gap-5">
              {nav.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`text-sm font-semibold ${
                    location.pathname === path
                      ? "text-brand-base"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Link
              to="/perfil"
              className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-800 font-medium text-sm hover:bg-gray-300 transition-colors"
              title="Perfil"
            >
              {initials}
            </Link>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
