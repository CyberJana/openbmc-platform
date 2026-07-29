import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { api } from "../services/api";
import type { User } from "../types";

const ACCESS_TOKEN_KEY = "openbmc_access_token";
const REFRESH_TOKEN_KEY = "openbmc_refresh_token";
const USER_KEY = "openbmc_user";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser());
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem(ACCESS_TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState<string | null>(() => localStorage.getItem(REFRESH_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(false);

  const clearState = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.login(email, password);
      setUser(response.user);
      setAccessToken(response.access_token);
      setRefreshToken(response.refresh_token);
      localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    const token = accessToken;
    try {
      if (token) {
        await api.auth.logout(token);
      }
    } finally {
      clearState();
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(user && accessToken),
      isLoading,
      login,
      logout,
    }),
    [accessToken, isLoading, refreshToken, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
