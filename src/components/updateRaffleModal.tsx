import { useState, useEffect } from "react";
import { RaffleType } from "../utils/types";
import { submitUpdateRaffle } from "../services";

export const UpdateRaffleModal = ({
  isOpen,
  onClose,
  existingRaffle,
}: {
  isOpen: boolean;
  onClose: () => void;
  existingRaffle: RaffleType | null;
}) => {
  const [raffleData, setRaffleData] = useState<RaffleType>({
    name: "",
    description: "",
    images: [],
    ticketPrice: "",
    visible: true,
    minValue: 1,
  });


  useEffect(() => {
    if (existingRaffle) {
      const processedRaffle = {
        ...existingRaffle,
        images: existingRaffle.images?.map((img: string) => {
          return img.includes("uploads/") ? img.split("uploads/")[1] : img;
        }) || [],
      };

      setRaffleData(processedRaffle);
    }
  }, [existingRaffle]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setRaffleData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "ticketPrice" || name === "minValue"
            ? value.replace(",", ".")
            : value,
    }));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let width = img.width;
          let height = img.height;

          if (width > 600 || height > 600) {
            const aspectRatio = width / height;
            if (width > height) {
              width = 600;
              height = Math.round(600 / aspectRatio);
            } else {
              height = 600;
              width = Math.round(600 * aspectRatio);
            }
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const base64String = canvas.toDataURL("image/jpeg", 1);
            resolve(base64String);
          } else {
            reject(new Error("No se pudo obtener el contexto del canvas."));
          }
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      Promise.all(files.map((file) => convertFileToBase64(file)))
        .then((base64Images) => {
          setRaffleData((prev) => ({
            ...prev,
            images: [...prev.images, ...base64Images],
          }));
        })
        .catch((error) => console.error("❌ Error al procesar imágenes:", error));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitUpdateRaffle(raffleData);
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la rifa:", error);
    }
  };

  console.log(raffleData)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-black">
          Actualizar Rifa
        </h2>
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
              Descripción
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
            <label className="text-black font-bold" htmlFor="ticketPrice">
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
            <label className="text-black font-bold" htmlFor="minValue">
              Mínimo de boletos
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
            <label className="text-black font-bold" htmlFor="images">
              Imágenes
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded text-black"
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            {raffleData.images.map((image, index) => (
              <div key={index} className="relative w-20 h-20">
                <button
                  type="button"
                  onClick={() => {
                    setRaffleData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ✕
                </button>

                <img
                  src={
                    image.includes("uploads/")
                      ? image.split("uploads/")[1]
                      : image
                  }
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              </div>
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
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
