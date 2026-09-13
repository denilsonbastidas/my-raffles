import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { swal } from "@/utils/swal";
import { getMoneySummary } from "@/services";
import Modal from "@/components/ui/Modal";
import { FiDollarSign } from "react-icons/fi";

interface MoneySummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface BreakdownItem {
    paymentMethod: string;
    total: number;
}

const accentColors: Record<string, string> = {
    bdv: "text-yellow-400 bg-yellow-400/10",
    zelle: "text-purple-300 bg-purple-500/10",
    binance: "text-amber-300 bg-amber-500/10",
    nequi: "text-pink-300 bg-pink-500/10",
    efectivo: "text-gray-300 bg-gray-500/10",
    bancolombia: "text-yellow-300 bg-yellow-500/10",
    default: "text-success bg-success/10",
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
                    swal.fire("Error", "No se pudo obtener el resumen de dinero.", "error");
                })
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Totales por Método de Pago"
            maxWidth="max-w-4xl"
        >
            {loading ? (
                <Skeleton count={3} height={90} className="rounded-2xl" />
            ) : breakdown.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {breakdown.map((item) => {
                        const accent =
                            accentColors[item.paymentMethod.toLowerCase()] || accentColors.default;

                        return (
                            <div
                                key={item.paymentMethod}
                                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-5"
                            >
                                <span
                                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${accent}`}
                                >
                                    <FiDollarSign size={18} />
                                </span>
                                <div className="text-xs uppercase font-bold tracking-wider text-gray-500 dark:text-gray-400">
                                    {item.paymentMethod}
                                </div>
                                <div className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
                                    {item.total.toLocaleString(undefined)}{" "}
                                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                                        {item.paymentMethod === "BDV" ? "Bs" : "USD"}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-danger mt-4">No hay datos disponibles.</p>
            )}
        </Modal>
    );
};

export default MoneySummaryModal;
