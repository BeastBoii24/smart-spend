import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthState, User } from "@/types/finance";
import { authApi } from "@/lib/api";

interface AuthActionResult {
  success: boolean;
  message: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthActionResult>;
  register: (name: string, email: string, password: string) => Promise<AuthActionResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const CURRENT_USER_KEY = "smartspend_current_user";

function parseStoredUser(value: string): User | null {
  try {
    return JSON.parse(value) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    userId: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!storedUser) {
      return;
    }

    const user = parseStoredUser(storedUser);
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
      return;
    }

    setAuthState({
      isAuthenticated: true,
      user,
      userId: user.id,
    });
  }, []);

  const persistUser = (user: User) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  };

  const login = async (email: string, password: string): Promise<AuthActionResult> => {
    try {
      const response = await authApi.login(email, password);
      persistUser(response.user);
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        userId: response.user.id,
      });

      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to login right now.",
      };
    }
  };

  const register = async (name: string, email: string, password: string): Promise<AuthActionResult> => {
    try {
      const response = await authApi.register(name, email, password);
      persistUser(response.user);
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        userId: response.user.id,
      });

      return { success: true, message: response.message };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unable to register right now.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    void authApi.logout().catch(() => undefined);
    setAuthState({
      isAuthenticated: false,
      user: null,
      userId: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
