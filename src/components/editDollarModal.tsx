import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import { getParallelDollar, updateParallelDollar } from "@/services";

interface EditDollarModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDollarUpdated?: (newPrice: number) => void;
}

const EditDollarModal: React.FC<EditDollarModalProps> = ({
    isOpen,
    onClose,
    onDollarUpdated,
}) => {
    const [dollarPrice, setDollarPrice] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [initializing, setInitializing] = useState<boolean>(true);

    useEffect(() => {
        if (isOpen) {
            setInitializing(true);
            getParallelDollar()
                .then((data) => {
                    setDollarPrice(data.priceEnparalelovzla.toString());
                })
                .catch((err) => {
                    console.error("Error al obtener precio:", err);
                    setDollarPrice("");
                })
                .finally(() => setInitializing(false));
        }
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const parsed = parseFloat(dollarPrice);
        if (isNaN(parsed) || parsed <= 0) {
            Swal.fire("Error", "Por favor ingresa un número válido.", "error");
            return;
        }

        try {
            setLoading(true);
            const response = await updateParallelDollar(parsed.toString());

            if (response.success) {
                Swal.fire("¡Actualizado!", "Precio actualizado correctamente", "success");
                if (response.success && response.updated !== undefined) {
                    onDollarUpdated?.(response.updated);
                }
                onClose();
            } else {
                Swal.fire("Error", response.error, "error");
            }
        } catch (err) {
            console.error("Error al actualizar:", err);
            Swal.fire("Error", "No se pudo actualizar el precio.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-3xl"
                >
                    ✕
                </button>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <h2 className="text-black text-xl font-bold">
                        Actualizar precio del dólar (VES)
                    </h2>

                    {initializing ? (
                        <Skeleton width={300} height={40} />
                    ) : (
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={dollarPrice}
                            onChange={(e) => setDollarPrice(e.target.value)}
                            className="w-full p-2 border rounded text-black"
                            placeholder="Precio actual en bolívares"
                            required
                        />
                    )}

                    {loading ? (
                        <Skeleton width={500} height={40} className="animate-pulse" />
                    ) : (
                        <button
                            type="submit"
                            className="px-4 py-2 w-full bg-green-600 text-white font-semibold rounded"
                        >
                            Guardar cambios
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditDollarModal;
