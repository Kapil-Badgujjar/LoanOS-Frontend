"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

type DecodedToken = {
  user_id: number;
  is_admin?: boolean;
  exp: number;
};

type AuthContextType = {
  token: string | null;
  userId: number | null;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("token");

    if (stored) {
      try {
        const decoded = jwtDecode<DecodedToken>(stored);

        // token expired?
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
        } else {
          setToken(stored);
          setUserId(decoded.user_id);
          setIsAdmin(Boolean(decoded.is_admin));
        }
      } catch {
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);

    const decoded = jwtDecode<DecodedToken>(token);

    setToken(token);
    setUserId(decoded.user_id);
    setIsAdmin(Boolean(decoded.is_admin));

    if (decoded.is_admin) {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserId(null);
    setIsAdmin(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ token, userId, isAdmin, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
