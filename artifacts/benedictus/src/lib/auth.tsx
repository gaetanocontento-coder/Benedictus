import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { setAuthTokenGetter, useBGetMe } from "@workspace/api-client-react";
import type { BAuthUser } from "@workspace/api-client-react";

interface AuthContextType {
  user: BAuthUser | null;
  isLoading: boolean;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("benedictus_token")
  );
  const [, setLocation] = useLocation();

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("benedictus_token", newToken);
      setAuthTokenGetter(() => newToken);
    } else {
      localStorage.removeItem("benedictus_token");
      setAuthTokenGetter(null);
    }
    setTokenState(newToken);
  };

  useEffect(() => {
    const stored = localStorage.getItem("benedictus_token");
    if (stored) {
      setAuthTokenGetter(() => stored);
    }
  }, []);

  const { data: user, isLoading, error } = useBGetMe({
    query: {
      enabled: !!token,
      retry: false,
      queryKey: [],
    },
  });

  useEffect(() => {
    if (error) {
      setToken(null);
    }
  }, [error]);

  const logout = () => {
    setToken(null);
    setLocation("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading: isLoading && !!token,
        token,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
