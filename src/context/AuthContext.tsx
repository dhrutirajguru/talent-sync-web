import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi, type RegisterPayload } from "@/api/auth";
import { getAuthToken, setAuthToken } from "@/api/client";
import type { MeOut } from "@/types/auth";

interface AuthContextValue {
  user: MeOut | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => setAuthToken(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await authApi.login(email, password);
    setAuthToken(access_token);
    const me = await authApi.me();
    setUser(me);
  }

  async function register(payload: RegisterPayload) {
    await authApi.register(payload);
    await login(payload.email, payload.password);
  }

  function logout() {
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

/** Convenience: the user's primary role for nav/dashboard routing.
 * Demo scope assumes one role per user (register only assigns one). */
export function usePrimaryRole(): string | null {
  const { user } = useAuth();
  return user?.role_codes[0] ?? null;
}
