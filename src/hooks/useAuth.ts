import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      if (window.location.pathname !== "/signup") {
        navigate("/signin", { replace: true });
      }
    }
  }, [navigate]);

  return isAuthenticated;
};

export default useAuth;
