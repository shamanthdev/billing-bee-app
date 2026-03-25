import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  token: string;
  email: string;
  name: string;
  businessName: string;
  address: string;
  phone: string;
  gstNumber: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  login: (data: User) => void;
  logout: () => void;
  userDetails: User | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    setIsAuthenticated(!!token);
    setUserDetails(user ? JSON.parse(user) : null);
  }, []);

  // 🔥 UPDATED LOGIN
  const login = (data: User) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));

    setIsAuthenticated(true);
    setUserDetails(data); // 🔥 IMPORTANT
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};