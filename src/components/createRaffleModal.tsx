import { useState } from "react";
import { RaffleType } from "../utils/types";
import { submitCreateRaffle } from "../services";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import PrizesEditor from "@/components/ui/PrizesEditor";

export const CreateRaffleModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [raffleData, setRaffleData] = useState<RaffleType>({
    name: "",
    description: "",
    images: [],
    ticketPrice: "",
    visible: true,
    minValue: 1,
    prizes: [
      { title: "Premio Mayor", amount: "" },
      { title: "Números Bendecidos", amount: "" },
    ],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setRaffleData((prev) => ({
      ...prev,
      [name]:
        name === "ticketPrice" || name === "minValue"
          ? value.replace(",", ".")
          : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const promises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        });
      });

      Promise.all(promises)
        .then((base64Images) => {
          setRaffleData((prev) => ({
            ...prev,
            images: [...prev.images, ...base64Images],
          }));
        })
        .catch((error) => console.error("Error al convertir imágenes:", error));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      await submitCreateRaffle(raffleData);
      window.location.reload();
    } catch (error) {
      console.error("Error al crear la rifa:", error);
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Rifa">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la rifa"
          name="name"
          placeholder="Nombre de la rifa"
          value={raffleData.name}
          onChange={handleChange}
          required
        />

        <Textarea
          label="Descripción"
          name="description"
          placeholder="Descripción"
          value={raffleData.description}
          onChange={handleChange}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Precio del boleto"
            type="number"
            name="ticketPrice"
            placeholder="Precio del boleto"
            value={raffleData.ticketPrice}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
          />
          <Input
            label="Mínimo de boletos"
            type="number"
            name="minValue"
            placeholder="Mínimo de boletos"
            value={raffleData.minValue}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
            Imágenes
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 dark:text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gray-200 dark:file:bg-gray-700 file:text-gray-700 dark:file:text-white file:font-semibold hover:file:bg-gray-300 dark:hover:file:bg-gray-600 transition"
          />
        </div>

        {raffleData.images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {raffleData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
              />
            ))}
          </div>
        )}

        <div className="pt-1">
          <PrizesEditor
            prizes={raffleData.prizes ?? []}
            onChange={(prizes) => setRaffleData((prev) => ({ ...prev, prizes }))}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            Crear Rifa
          </Button>
        </div>
      </form>
    </Modal>
  );
};
