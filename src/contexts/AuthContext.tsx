import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { validationToken } from "../services";

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await validationToken();
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.clear();
          navigate("/signin", { replace: true });
        }
      } else {
        if (window.location.pathname !== "/signup") {
          navigate("/signin", { replace: true });
        }
      }
      setIsLoading(false);
    };

    verifyToken();
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
