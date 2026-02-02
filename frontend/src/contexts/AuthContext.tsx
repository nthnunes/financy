import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { setGraphQLToken } from "@/lib/graphql";

const TOKEN_KEY = "financy_token";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextValue {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    setGraphQLToken(t);
    return t;
  });
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("financy_user");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setGraphQLToken(token);
  }, [token]);

  const setAuth = useCallback((newToken: string, newUser: User) => {
    setTokenState(newToken);
    setUser(newUser);
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem("financy_user", JSON.stringify(newUser));
    setGraphQLToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setTokenState(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("financy_user");
    setGraphQLToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
