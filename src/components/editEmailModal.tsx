import { updatedUser } from "@/services";
import React, { useState } from "react";
import { swal, swalSuccess } from "@/utils/swal";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface EditEmailProps {
  currentTikketSelected: { email: string; id: string; phone: string, numberTickets: number, paymentMethod: string };
  isOpen: boolean;
  onClose: () => void;
  onEmailUpdated: (id: string, newEmail: string, newPhone: string, newNumberTickets: number, newPaymentMethod: string) => void;
}

const EditEmailModal: React.FC<EditEmailProps> = ({
  isOpen,
  onClose,
  currentTikketSelected,
  onEmailUpdated,
}) => {
  const [selectedTikket, setSelectedTikket] = useState<{
    email: string;
    phone: string;
    id: string;
    numberTickets: number;
    paymentMethod: string;
  }>(currentTikketSelected);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(selectedTikket.email)) {
      swal.fire({
        title: "Error",
        text: "Por favor, ingresa un email válido.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      setLoading(true);
      await updatedUser(
        selectedTikket.id,
        selectedTikket.email,
        selectedTikket.phone,
        selectedTikket.numberTickets,
        selectedTikket.paymentMethod
      );

      swalSuccess.fire({
        title: "Datos Actualizados!",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      onEmailUpdated(
        selectedTikket.id,
        selectedTikket.email,
        selectedTikket.phone,
        selectedTikket.numberTickets,
        selectedTikket.paymentMethod,
      );
      onClose();
    } catch (error) {
      console.error("Error actualizar Datos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Actualizar Datos del Cliente"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Correo Electrónico"
          type="email"
          name="email"
          placeholder="Email"
          value={selectedTikket.email}
          onChange={(e) =>
            setSelectedTikket({ ...selectedTikket, email: e.target.value })
          }
          required
        />

        <Input
          label="Número de Teléfono"
          type="tel"
          name="phone"
          placeholder="Número de teléfono"
          value={selectedTikket.phone}
          onChange={(e) =>
            setSelectedTikket({ ...selectedTikket, phone: e.target.value })
          }
          required
        />

        <Input
          label="Número de Tickets"
          type="number"
          name="numberTickets"
          placeholder="Cantidad de Tickets"
          min="1"
          value={selectedTikket.numberTickets}
          onChange={(e) =>
            setSelectedTikket({
              ...selectedTikket,
              numberTickets: Number(e.target.value),
            })
          }
          required
        />

        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5"
          >
            Método de Pago
          </label>
          <select
            id="paymentMethod"
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:border-primary transition"
            value={selectedTikket.paymentMethod}
            onChange={(e) =>
              setSelectedTikket({ ...selectedTikket, paymentMethod: e.target.value })
            }
            required
          >
            <option value="">Selecciona método de pago</option>
            <option value="BDV">BDV</option>
            <option value="zelle">Zelle</option>
            <option value="binance">Binance</option>
          </select>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Guardar Cambios
        </Button>
      </form>
    </Modal>
  );
};

export default EditEmailModal;
