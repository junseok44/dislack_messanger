// src/contexts/AuthContext.tsx
import { API_ROUTE } from "@/constants/routeName";
import { api, ApiError } from "@/lib/fetch";
import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: (redirectUrl?: string) => void;
}

interface User {
  username: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [networkError, setNetworkError] = useState<boolean>(false);

  const navigate = useNavigate();

  const login = (user: User) => {
    if (user) {
      setUser(user);
    }
  };

  const { mutate: logoutAndRedirect } = useMutation({
    mutationFn: (redirectUrl?: string) => api.post(API_ROUTE.LOGOUT, {}),
    onSuccess: (_, redirectUrl) => {
      setUser(null);
      if (redirectUrl) navigate(redirectUrl);
    },
  });

  const logout = (redirectUrl?: string) => {
    logoutAndRedirect(redirectUrl);
  };

  const { mutate: checkUser } = useMutation({
    mutationFn: () => api.get(API_ROUTE.CHECK, {}),
    onError: (err) => {
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          logout();
          return;
        }

        setNetworkError(true);
      }
    },
    onSuccess: (data: {
      user: {
        username: string;
      };
    }) => {
      login(data.user);
      setNetworkError(false);
    },
  });

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {networkError ? (
        <div>
          <h1>Network Error</h1>
          <p>Check your network connection and try again</p>
          <button onClick={() => checkUser()}>Retry</button>
        </div>
      ) : (
        children
      )}
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