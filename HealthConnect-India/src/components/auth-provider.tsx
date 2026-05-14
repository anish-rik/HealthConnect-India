import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/apiClient';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'doctor' | 'admin';
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
  login: (email: string, password: string) => Promise<void>;
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
    const savedToken = localStorage.getItem('authToken');
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
          localStorage.removeItem('authToken');
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

  const login = async (email: string, password: string) => {
    const res = await apiClient.auth.login({ email, password });
    const { token: newToken, user: newUser } = res.data;
    
    apiClient.setToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    apiClient.removeToken();
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
