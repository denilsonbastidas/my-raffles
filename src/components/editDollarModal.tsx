import React, { useEffect, useState } from "react";
import { swal, swalSuccess } from "@/utils/swal";
import Skeleton from "react-loading-skeleton";
import { getParallelDollar, updateParallelDollar } from "@/services";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
            swal.fire("Error", "Por favor ingresa un número válido.", "error");
            return;
        }

        try {
            setLoading(true);
            const response = await updateParallelDollar(parsed.toString());

            if (response.success) {
                swalSuccess.fire("¡Actualizado!", "Precio actualizado correctamente", "success");
                if (response.success && response.updated !== undefined) {
                    onDollarUpdated?.(response.updated);
                }
                onClose();
            } else {
                swal.fire("Error", response.error, "error");
            }
        } catch (err) {
            console.error("Error al actualizar:", err);
            swal.fire("Error", "No se pudo actualizar el precio.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Actualizar precio del dólar (VES)">
            <form onSubmit={handleSubmit} className="space-y-5">
                {initializing ? (
                    <Skeleton height={44} className="rounded-xl" />
                ) : (
                    <Input
                        label="Precio actual en bolívares"
                        type="number"
                        min={0}
                        step="0.01"
                        value={dollarPrice}
                        onChange={(e) => setDollarPrice(e.target.value)}
                        placeholder="Precio actual en bolívares"
                        required
                    />
                )}

                <Button type="submit" variant="success" fullWidth loading={loading}>
                    Guardar cambios
                </Button>
            </form>
        </Modal>
    );
};

export default EditDollarModal;
