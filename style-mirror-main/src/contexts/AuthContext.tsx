import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getMe,
  login as apiLogin,
  register as apiRegister,
  googleLogin as apiGoogleLogin,
  type AuthUser,
  type TokenResponse,
} from "@/lib/api";

const TOKEN_KEY = "tryon_access_token";
const USER_KEY = "tryon_user";

function readStored(): { token: string | null; user: AuthUser | null } {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    const user = userJson ? (JSON.parse(userJson) as AuthUser) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

function persist(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearStorage() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyAuth = useCallback((data: TokenResponse) => {
    setToken(data.access_token);
    setUser(data.user);
    persist(data.access_token, data.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiLogin(email, password);
      applyAuth(data);
    },
    [applyAuth]
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      await apiRegister(email, password, fullName);
    },
    []
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const data = await apiGoogleLogin(idToken);
      applyAuth(data);
    },
    [applyAuth]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearStorage();
  }, []);

  const refreshUser = useCallback(async () => {
    const t = token || localStorage.getItem(TOKEN_KEY);
    if (!t) return;
    try {
      const u = await getMe(t);
      setUser(u);
      localStorage.setItem(USER_KEY, JSON.stringify(u));
    } catch {
      logout();
    }
  }, [token, logout]);

  useEffect(() => {
    const { token: t, user: u } = readStored();
    if (t && u) {
      setToken(t);
      setUser(u);
      getMe(t)
        .then((fresh) => {
          setUser(fresh);
          localStorage.setItem(USER_KEY, JSON.stringify(fresh));
        })
        .catch(() => {
          clearStorage();
          setToken(null);
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextValue = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
