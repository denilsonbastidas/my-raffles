import { useState, useEffect } from "react";
import { RaffleType } from "../utils/types";
import { submitUpdateRaffle } from "../services";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import PrizesEditor from "@/components/ui/PrizesEditor";
import { FiX } from "react-icons/fi";

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
    prizes: [],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existingRaffle) {
      const processedRaffle = {
        ...existingRaffle,
        images: existingRaffle.images?.map((img: string) => {
          return img.includes("uploads/") ? img.split("uploads/")[1] : img;
        }) || [],
        prizes: existingRaffle.prizes ?? [],
      };

      setRaffleData(processedRaffle);
    }
  }, [existingRaffle]);

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

          if (width > 750 || height > 750) {
            const aspectRatio = width / height;
            if (width > height) {
              width = 750;
              height = Math.round(750 / aspectRatio);
            } else {
              height = 750;
              width = Math.round(750 * aspectRatio);
            }
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const base64String = canvas.toDataURL("image/jpeg", .8);
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
      setSubmitting(true);
      await submitUpdateRaffle(raffleData);
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la rifa:", error);
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualizar Rifa">
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
          <div className="flex flex-wrap gap-3">
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
                  aria-label="Quitar imagen"
                  className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-danger-hover transition"
                >
                  <FiX size={12} />
                </button>

                <img
                  src={
                    image.includes("uploads/")
                      ? image.split("uploads/")[1]
                      : image
                  }
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
                />
              </div>
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
          <Button type="submit" variant="success" loading={submitting}>
            Guardar Cambios
          </Button>
        </div>
      </form>
    </Modal>
  );
};
