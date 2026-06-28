import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import api, { setAccessToken, setAuthHandlers } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "codesage-token";
const USER_KEY = "codesage-user";

function readStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function persistAuth({ token, user }) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    setAccessToken(token);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  setAccessToken(null);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readStoredUser());
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const syncAuthState = useCallback((nextToken, nextUser) => {
    setToken(nextToken || null);
    setUser(nextUser || null);

    persistAuth({
      token: nextToken,
      user: nextUser,
    });
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });

    if (data?.token && data?.user) {
      syncAuthState(data.token, data.user);
    }

    return data;
  }, [syncAuthState]);

  const register = useCallback(async ({ username, email, password, role }) => {
    const { data } = await api.post("/api/auth/register", {
      username,
      email,
      password,
      role,
    });

    if (data?.token && data?.user) {
      syncAuthState(data.token, data.user);
    }

    return data;
  }, [syncAuthState]);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {
      // Ignore backend logout errors; clear local state anyway.
    } finally {
      clearAuth();
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    setAuthHandlers({
      onRefreshSuccess: (data) => {
        if (data?.token && data?.user) {
          syncAuthState(data.token, data.user);
        }
      },
      onAuthFailure: () => {
        clearAuth();
        setToken(null);
        setUser(null);
      },
    });

    return () => {
      setAuthHandlers({
        onRefreshSuccess: null,
        onAuthFailure: null,
      });
    };
  }, [syncAuthState]);

  useEffect(() => {
    let isMounted = true;

    async function bootstrapSession() {
      try {
        const { data } = await api.post("/api/auth/refresh");

        if (!isMounted) return;

        if (data?.token && data?.user) {
          syncAuthState(data.token, data.user);
        } else {
          clearAuth();
          setToken(null);
          setUser(null);
        }
      } catch {
        if (!isMounted) return;
        clearAuth();
        setToken(null);
        setUser(null);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [syncAuthState]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isLoading,
      login,
      register,
      logout,
      setUser,
      setToken,
    }),
    [user, token, isLoading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}