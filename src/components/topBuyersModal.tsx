import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { swal } from "@/utils/swal";
import { getTopBuyers } from "@/services";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface TopBuyersModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}

interface Buyer {
  _id: string;
  fullName: string;
  phone: string;
  totalTickets: number;
  purchases: number;
}

const TopBuyersModal: React.FC<TopBuyersModalProps> = ({ isOpen, onClose, theme = "dark" }) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"info" | "chart">("info");
  const [filter, setFilter] = useState<"total" | "custom">("total");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true);
      const data =
        filter === "custom"
          ? await getTopBuyers("custom", startDate, endDate)
          : await getTopBuyers("total");
      setBuyers(data);
    } catch (err) {
      console.error("Error al obtener top de compradores:", err);
      swal.fire("Error", "No se pudo obtener el top de compradores.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, filter]);

  const handleApplyFilter = () => {
    if (!startDate || !endDate) {
      swal.fire("Aviso", "Debe seleccionar ambas fechas.", "warning");
      return;
    }
    fetchData();
  };

  const scaledBuyers = buyers.map((buyer) => {
    const scaledValue = Math.sqrt(buyer.totalTickets) * 10;
    const nameParts = buyer.fullName.split(" ");
    const shortName = nameParts.slice(0, 2).join(" ");
    return { ...buyer, fullName: shortName, scaledTickets: scaledValue };
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Participantes con más tickets"
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-5 flex-wrap">
        <div className="w-full sm:w-auto flex flex-col items-stretch sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-primary transition"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as "total" | "custom");
                if (e.target.value === "custom") setShowFilters(true);
              }}
            >
              <option value="total">Top General</option>
              <option value="custom">Personalizado</option>
            </select>

            {filter === "custom" && (
              <button
                type="button"
                aria-label="Mostrar filtros de fecha"
                className="sm:hidden flex items-center justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-white rounded-xl px-3 py-2.5 transition"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
              </button>
            )}
          </div>

          {filter === "custom" && showFilters && (
            <>
              <input
                type="date"
                className="px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-primary transition"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-primary transition"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <Button variant="primary" onClick={handleApplyFilter}>
                Aplicar
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === "info" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("info")}
          >
            Información
          </Button>
          <Button
            variant={view === "chart" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("chart")}
          >
            Gráfico
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton count={6} height={40} className="rounded-lg" />
      ) : view === "info" ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 dark:bg-gray-900/60 text-gray-600 dark:text-gray-200 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Nombre</th>
                <th className="p-3">Email</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Tickets</th>
                <th className="p-3">Compras</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer, index) => (
                <tr
                  key={buyer._id}
                  className="border-t border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3 text-gray-400">{index + 1}</td>
                  <td className="p-3 font-medium">{buyer.fullName}</td>
                  <td className="p-3 text-gray-500 dark:text-gray-400">{buyer._id}</td>
                  <td className="p-3">{buyer.phone}</td>
                  <td className="p-3 font-semibold text-blue-600 dark:text-blue-300">{buyer.totalTickets}</td>
                  <td className="p-3">{buyer.purchases}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-[120%] sm:w-full h-[450px] ml-[-20%] sm:ml-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={scaledBuyers}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 80, bottom: 10 }}
              barCategoryGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === "dark" ? "#344054" : "#E4E7EC"} />
              <XAxis type="number" tick={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="fullName"
                tick={{ fontSize: 13, fontWeight: 600, fill: theme === "dark" ? "#D0D5DD" : "#344054" }}
                width={120}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1D2939" : "#ffffff",
                  border: theme === "dark" ? "1px solid #344054" : "1px solid #E4E7EC",
                  borderRadius: 12,
                  color: theme === "dark" ? "#fff" : "#101828",
                }}
                formatter={(_, __, entry: any) => [
                  `${entry.payload.totalTickets} tickets`,
                  "Tickets",
                ]}
                labelFormatter={(label: any) => `Comprador: ${label}`}
              />
              <Bar dataKey="scaledTickets" fill="#2563EB" barSize={36} radius={[0, 6, 6, 0]}>
                <LabelList
                  dataKey="totalTickets"
                  position="insideRight"
                  fill="#ffffff"
                  fontSize={14}
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Modal>
  );
};

export default TopBuyersModal;
