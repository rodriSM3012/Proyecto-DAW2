/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api, { setUnauthorizedHandler } from "../services/api.js";
import { RoleProvider } from "./RoleContext.jsx";

const ROLE_LEVELS = {
  auditor: 1,
  operador: 2,
  admin: 3,
};

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loading: true,
  roleLevel: 0,
  login: async () => {},
  logout: async () => {},
  registerUser: async () => {},
  hasRole: () => false,
});

const STORAGE_KEY = "inventory_auth_user";
const TOKEN_KEY = "access_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);
    if (!savedUser) {
      return null;
    }
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });
  const loading = false;

  const roleLevel = ROLE_LEVELS[user?.role] ?? 0;
  const hasRole = useMemo(
    () => (minimumRole) => {
      const minimumLevel = ROLE_LEVELS[minimumRole] ?? Number.MAX_SAFE_INTEGER;
      return roleLevel >= minimumLevel;
    },
    [roleLevel],
  );

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    });
  }, []);

  const login = async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    const nextUser = response.data?.user;
    const token = response.data?.token;

    if (!nextUser || !token) {
      throw new Error("La respuesta del servidor no incluyó usuario o token.");
    }

    setUser(nextUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    localStorage.setItem(TOKEN_KEY, token);
    return nextUser;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const registerUser = async (payload) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      roleLevel,
      login,
      logout,
      registerUser,
      hasRole,
    }),
    [user, loading, roleLevel, hasRole],
  );

  const roleContextValue = useMemo(
    () => ({
      role: user?.role ?? null,
      roleLevel,
      hasRole,
    }),
    [user?.role, roleLevel, hasRole],
  );

  return (
    <AuthContext.Provider value={value}>
      <RoleProvider value={roleContextValue}>{children}</RoleProvider>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
