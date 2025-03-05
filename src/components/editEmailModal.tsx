import { updatedEmail } from "@/services";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";

interface EditEmailProps {
  currentTikketSelected: { email: string; id: string };
  isOpen: boolean;
  onClose: () => void;
  onEmailUpdated: (id: string, newEmail: string) => void;
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
    id: string;
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
      await updatedEmail(selectedTikket.id, selectedTikket.email);
      Swal.fire({
        title: "Email Actualizado!",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      onEmailUpdated(selectedTikket.id, selectedTikket.email);
      onClose();
    } catch (error) {
      console.error("Error actualizar Email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-3xl"
        >
          ✕
        </button>
        <form onSubmit={handleSubmit} className="space-y-8">
          <label className="text-black font-bold" htmlFor="email">
            Actualizar Email:
          </label>
          <input
            name="email"
            placeholder="Email"
            value={selectedTikket.email}
            onChange={(e) =>
              setSelectedTikket({
                email: e.target.value,
                id: currentTikketSelected.id,
              })
            }
            className="w-full p-2 border rounded text-black"
            required
          />

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
              className="px-4 py-2 w-full bg-blue-500 text-white rounded"
            >
              Enviar
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditEmailModal;
