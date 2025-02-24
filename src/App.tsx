import Admin from "./pages/Admin";
import HomePage from "./pages/HomePage";
import { Route, Routes } from "react-router-dom";
import Panel from "./pages/Panel";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/panel" element={<Panel />} />
    </Routes>
  );
}

export default App;
