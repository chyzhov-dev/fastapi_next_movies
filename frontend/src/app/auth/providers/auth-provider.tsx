"use client";

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";
import { LoginInput } from "../schema/login-schema";
import { useCookies } from "react-cookie";
import { apiCallWrapper, toastOnError } from "@/lib/api-client";
import { toast } from "sonner";

export const AuthContext = createContext<AuthContextType>({
  login: () => {
    return Promise.resolve();
  },
  logout: () => {},
  isAuthenticated: false,
});

type AuthContextType = {
  login: (data: LoginInput) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

type Props = PropsWithChildren<{}>;

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: Props) => {
  const [cookies, _, removeCookie] = useCookies();
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!cookies.access_token,
  );

  const login = async (data: LoginInput) => {
    const response = await apiCallWrapper<{ access_token: string }>({
      endpoint: "api/auth/login",
      method: "POST",
      body: data,
      onError: toastOnError,
    });

    if (response) {
      toast.success("Logged in successfully. Redirecting...");
      window.location.reload();
    }

    setIsAuthenticated(!!response?.access_token);
  };

  const logout = () => {
    setIsAuthenticated(false);
    removeCookie("access_token");

    window.location.reload();
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
