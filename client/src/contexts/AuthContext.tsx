// src/contexts/AuthContext.tsx
import { User } from "@/@types";
import { API_ROUTE } from "@/constants/routeName";
import useCheckUser from "@/hooks/useCheckUser";
import { api, ApiError } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  authError: boolean;
  login: (user: User) => void;
  logout: (redirectUrl?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<boolean>(false);

  const navigate = useNavigate();

  const login = (user: User) => {
    if (user) {
      setUser(user);
    }
  };

  const logout = (redirectUrl?: string) => {
    logoutAndRedirect(redirectUrl);
  };

  const { mutate: logoutAndRedirect } = useMutation({
    mutationFn: (redirectUrl?: string) => api.post(API_ROUTE.AUTH.LOGOUT, {}),
    onSuccess: (_, redirectUrl) => {
      setUser(null);
      if (redirectUrl) navigate(redirectUrl);
    },
  });

  const { mutate: checkUser } = useCheckUser();

  useEffect(() => {
    setAuthError(false);
    setAuthLoading(true);

    checkUser(undefined, {
      onError: (err) => {
        if (err instanceof ApiError) {
          if (err.statusCode === 403 || err.statusCode === 401) {
            logout();
            return;
          }

          setAuthError(true);
        }
      },
      onSettled: () => {
        setAuthLoading(false);
      },
      onSuccess: (response) => {
        login(response.data.user);
        setAuthError(false);
      },
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, authLoading, authError }}
    >
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
