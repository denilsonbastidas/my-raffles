import { useState } from "react";
import { RaffleType } from "../utils/types";
import { submitCreateRaffle } from "../services";

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
  });

  if (!isOpen) return null;

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
      await submitCreateRaffle(raffleData);
      window.location.reload();
    } catch (error) {
      console.error("Error al crear la rifa:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Crear Nueva Rifa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-black font-bold" htmlFor="name">
              Nombre de la rifa
            </label>
            <input
              name="name"
              placeholder="Nombre de la rifa"
              value={raffleData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="text-black font-bold" htmlFor="description">
              descripcion
            </label>
            <textarea
              name="description"
              placeholder="Descripción"
              value={raffleData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="text-black font-bold" htmlFor="description">
              Precio del boleto
            </label>
            <input
              type="number"
              name="ticketPrice"
              placeholder="Precio del boleto"
              value={raffleData.ticketPrice}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="text-black font-bold" htmlFor="description">
              Minimo de boletos
            </label>
            <input
              type="number"
              name="minValue"
              placeholder="Mínimo de boletos"
              value={raffleData.minValue}
              onChange={handleChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="text-black font-bold" htmlFor="description">
              imagenes
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {raffleData.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded border"
              />
            ))}
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Crear Rifa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
