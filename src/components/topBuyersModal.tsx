import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";
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

interface TopBuyersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Buyer {
  _id: string;
  fullName: string;
  phone: string;
  totalTickets: number;
  purchases: number;
}

const TopBuyersModal: React.FC<TopBuyersModalProps> = ({ isOpen, onClose }) => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"info" | "chart">("info");
  const [filter, setFilter] = useState<"today" | "total" | "yesterday">("total");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getTopBuyers(filter)
        .then((data) => setBuyers(data))
        .catch((err) => {
          console.error("Error al obtener top de compradores:", err);
          Swal.fire("Error", "No se pudo obtener el top de compradores.", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen, filter]);

  if (!isOpen) return null;

  const scaledBuyers = buyers.map((buyer) => {
    const scaledValue = Math.sqrt(buyer.totalTickets) * 10;

    const nameParts = buyer.fullName.split(" ");
    const shortName = nameParts.slice(0, 2).join(" ");

    return {
      ...buyer,
      fullName: shortName,
      scaledTickets: scaledValue,
    };
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl md:text-3xl"
        >
          ✕
        </button>

        <h2 className="text-black text-lg md:text-xl font-bold mb-4 text-center">
          Participantes con más tickets
        </h2>

        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <select
            className="text-black border px-2 py-1 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value as "today" | "total" | "yesterday")}
          >
            <option value="today">Top de Hoy</option>
            <option value="yesterday">Top de Ayer</option>
            <option value="total">Top General</option>
          </select>

          <div className="flex gap-2">
            <button
              className={`w-28 py-2 text-sm rounded-full border font-medium transition-all duration-200 ${view === "info"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-100"
                }`}
              onClick={() => setView("info")}
            >
              Información
            </button>
            <button
              className={`w-28 py-2 text-sm rounded-full border font-medium transition-all duration-200 ${view === "chart"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-100"
                }`}
              onClick={() => setView("chart")}
            >
              Gráfico
            </button>
          </div>
        </div>

        {loading ? (
          <Skeleton count={6} height={40} />
        ) : view === "info" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base border border-gray-500 text-left text-black">
              <thead className="bg-black text-white text-xs md:text-sm">
                <tr>
                  <th className="p-2 border-b whitespace-nowrap">#</th>
                  <th className="p-2 border-b whitespace-nowrap">Nombre</th>
                  <th className="p-2 border-b whitespace-nowrap">Email</th>
                  <th className="p-2 border-b whitespace-nowrap">Teléfono</th>
                  <th className="p-2 border-b whitespace-nowrap">Tickets</th>
                  <th className="p-2 border-b whitespace-nowrap">Compras</th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer, index) => (
                  <tr key={buyer._id} className="text-xs md:text-sm">
                    <td className="p-2 border-b border-gray-500">{index + 1}</td>
                    <td className="p-2 border-b break-words border-gray-500">{buyer.fullName}</td>
                    <td className="p-2 border-b break-words border-gray-500">{buyer._id}</td>
                    <td className="p-2 border-b break-words border-gray-500">{buyer.phone}</td>
                    <td className="p-2 border-b border-gray-500">{buyer.totalTickets}</td>
                    <td className="p-2 border-b border-gray-500">{buyer.purchases}</td>
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
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" tick={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="fullName"
                  tick={{ fontSize: 14, fontWeight: "bold" }}
                  width={120}
                />
                <Tooltip
                  formatter={(_value: any, _name: any, entry: any) => {
                    const realValue = entry.payload.totalTickets;
                    return [`${realValue} tickets`, "Tickets"];
                  }}
                  labelFormatter={(label: any) => `Comprador: ${label}`}
                />
                <Bar dataKey="scaledTickets" fill="#000000" barSize={36}>
                  <LabelList
                    dataKey="totalTickets"
                    position="insideRight"
                    fill="#ffffff"
                    fontSize={15}
                    fontWeight={"bold"}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBuyersModal;
