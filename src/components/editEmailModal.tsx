import { updatedUser } from "@/services";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";

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
  if (!isOpen) return null;

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
      Swal.fire({
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

      Swal.fire({
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-3xl"
        >
          ✕
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-xl font-bold text-black text-center mb-4">
            Actualizar Datos del Cliente
          </h2>

          <div className="flex flex-col space-y-1">
            <label htmlFor="email" className="text-black font-semibold">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={selectedTikket.email}
              onChange={(e) =>
                setSelectedTikket({ ...selectedTikket, email: e.target.value })
              }
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="phone" className="text-black font-semibold">
              Número de Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Número de teléfono"
              value={selectedTikket.phone}
              onChange={(e) =>
                setSelectedTikket({ ...selectedTikket, phone: e.target.value })
              }
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="numberTickets" className="text-black font-semibold">
              Número de Tickets
            </label>
            <input
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
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="paymentMethod" className="text-black font-semibold">
              Método de Pago
            </label>
            <select
              id="paymentMethod"
              className="w-full p-2 border rounded text-black"
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

          {loading ? (
            <div className="flex justify-center">
              <Skeleton
                width={500}
                className="animate-pulse max-w-[350px] md:max-w-full"
                height={40}
              />
            </div>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 w-full bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Guardar Cambios
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditEmailModal;
