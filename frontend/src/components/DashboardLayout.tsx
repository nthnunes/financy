import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, TrendingUp, ArrowLeftRight, Tag, User } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const nav = [
  { path: "/dashboard", label: "Dashboard", icon: TrendingUp },
  { path: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { path: "/categorias", label: "Categorias", icon: Tag },
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
          <div className="flex justify-between items-center h-16">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-primary font-semibold text-xl"
            >
              <Wallet size={28} className="text-primary" />
              FINANCY
            </Link>
            <nav className="flex items-center gap-6">
              {nav.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-1.5 text-sm font-medium ${
                    location.pathname === path
                      ? "text-primary"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
              <Link
                to="/perfil"
                className={`flex items-center gap-1.5 text-sm font-medium ${
                  location.pathname === "/perfil"
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <User size={18} />
                Perfil
              </Link>
              <Link
                to="/perfil"
                className="ml-2 w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium text-sm hover:bg-gray-300 transition-colors"
                title="Perfil"
              >
                {initials}
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
