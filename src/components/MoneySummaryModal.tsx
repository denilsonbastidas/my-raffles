import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";
import { getMoneySummary } from "@/services";

interface MoneySummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface BreakdownItem {
    paymentMethod: string;
    total: number;
}

const bgColors: Record<string, string> = {
    BDV: "bg-yellow-500 text-white",
    zelle: "bg-purple-600 text-white",
    binance: "bg-blue-600 text-white",
    nequi: "bg-pink-500 text-white",
    efectivo: "bg-gray-700 text-white",
    bancolombia: "bg-yellow-600 text-black",
    default: "bg-green-600 text-white",
};

const MoneySummaryModal: React.FC<MoneySummaryModalProps> = ({ isOpen, onClose }) => {
    const [breakdown, setBreakdown] = useState<BreakdownItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getMoneySummary()
                .then((data) => setBreakdown(data))
                .catch((err) => {
                    console.error("Error al obtener resumen de dinero:", err);
                    Swal.fire("Error", "No se pudo obtener el resumen de dinero.", "error");
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

                <h2 className="text-black text-lg md:text-xl font-bold mb-6 text-center">
                    Totales por Método de Pago
                </h2>

                {loading ? (
                    <Skeleton count={3} height={80} />
                ) : breakdown.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {breakdown.map((item) => {
                            const className =
                                bgColors[item.paymentMethod.toLowerCase()] || bgColors.default;

                            return (
                                <div
                                    key={item.paymentMethod}
                                    className={`rounded-2xl shadow-md p-6 text-center ${className}`}
                                >
                                    <div className="text-sm uppercase font-bold tracking-wider">
                                        {item.paymentMethod}
                                    </div>
                                    <div className="text-2xl font-bold mt-2">
                                        ${item.total.toLocaleString(undefined)} { item.paymentMethod == "BDV" ? " Bs " : " USD " }
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-red-600 mt-4">No hay datos disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default MoneySummaryModal;
