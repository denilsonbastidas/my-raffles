import Admin from "./pages/Admin";
import HomePage from "./pages/HomePage";
import { Route, Routes, useParams } from "react-router-dom";
import Panel from "./pages/Panel";
import "react-loading-skeleton/dist/skeleton.css";

function RaffleRoute() {
  const { raffleId } = useParams();
  return <HomePage key={raffleId || "home"} />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RaffleRoute />} />
      <Route path="/rifas/:raffleId" element={<RaffleRoute />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/panel" element={<Panel />} />
    </Routes>
  );
}

export default App;
