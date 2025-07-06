import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";
import { getTopBuyers } from "@/services";

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

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getTopBuyers()
        .then((data) => setBuyers(data))
        .catch((err) => {
          console.error("Error al obtener top de compradores:", err);
          Swal.fire("Error", "No se pudo obtener el top de compradores.", "error");
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 px-4">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-2xl md:text-3xl"
        >
          ✕
        </button>
        <h2 className="text-black text-lg md:text-xl font-bold mb-4 md:mb-6 text-center">
          Top 10 Compradores
        </h2>

        {loading ? (
          <Skeleton count={6} height={40} />
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default TopBuyersModal;
