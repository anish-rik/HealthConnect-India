import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";

interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "doctor" | "admin";
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  language?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  register: (data: any) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  loginAbha: (abhaId: string, password: string) => Promise<void>;
  /** Step 1 – request OTP to be sent to phone */
  sendLoginOtp: (phone: string) => Promise<{ devOtp?: string }>;
  /** Step 2 – verify OTP and sign in */
  loginPhoneOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    if (savedToken) {
      apiClient.setToken(savedToken);
      setToken(savedToken);

      // Fetch user profile
      apiClient.auth
        .getProfile()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const register = async (data: any) => {
    const res = await apiClient.auth.register(data);
    const { token: newToken, user: newUser } = res.data;

    apiClient.setToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const login = async (phone: string, password: string) => {
    const res = await apiClient.auth.login({ phone, password });
    const { token: newToken, user: newUser } = res.data;

    apiClient.setToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const loginAbha = async (abhaId: string, password: string) => {
    const res = await apiClient.auth.loginAbha({ abhaId, password });
    const { token: newToken, user: newUser } = res.data;

    apiClient.setToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  /** Step 1: ask server to SMS an OTP to the given phone */
  const sendLoginOtp = async (phone: string): Promise<{ devOtp?: string }> => {
    const res = await apiClient.auth.sendOtp(phone);
    // res.data.devOtp is only present when no SMS provider is configured (dev mode)
    return { devOtp: res.data?.devOtp };
  };

  /** Step 2: verify the OTP and log the user in */
  const loginPhoneOtp = async (phone: string, otp: string) => {
    const res = await apiClient.auth.verifyOtp(phone, otp);
    const { token: newToken, user: newUser } = res.data;

    apiClient.setToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    apiClient.removeToken();
    setToken(null);
    setUser(null);
    localStorage.removeItem("authToken");
  };

  const updateProfile = async (data: any) => {
    const res = await apiClient.auth.updateProfile(data);
    setUser(res.data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        register,
        login,
        loginAbha,
        sendLoginOtp,
        loginPhoneOtp,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
