// src/contexts/AuthContext.tsx
import { AUTH_TOKEN } from "@/constants/constants";
import { getItem, removeItem, setItem } from "@/lib/localStorage";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = () => {
    setItem(AUTH_TOKEN, "token");
    setIsAuthenticated(true);
  };

  const logout = () => {
    removeItem(AUTH_TOKEN);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = getItem(AUTH_TOKEN) || "";

    if (token !== "") {
      console.log("token", token);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
