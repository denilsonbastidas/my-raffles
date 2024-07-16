import "react-phone-number-input/style.css";
import "react-loading-skeleton/dist/skeleton.css";

import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import { useAuth } from "./contexts/AuthContext";
import Loading from "./components/Loading";

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Routes>
      <Route
        path="/signin"
        element={isAuthenticated ? <Navigate to={"/"} /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to={"/"} /> : <SignUp />}
      />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to={"/signin"} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
