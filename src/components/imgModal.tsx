import React, { useState } from "react";
import Modal from "@/components/ui/Modal";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
  loading?: boolean;
}

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  onClose,
  loading = false,
}) => {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const hasError = !imageUrl || failedUrl === imageUrl;

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Voucher de compra"
      maxWidth="max-w-xl"
    >
      <div className="flex justify-center">
        {loading ? (
          <div role="status" className="p-8">
            <span
              aria-hidden="true"
              className="block h-10 w-10 animate-spin rounded-full border-4 border-blue-500/20 border-t-blue-500"
            />
            <span className="sr-only">Cargando comprobante</span>
          </div>
        ) : hasError ? (
          <p
            role="alert"
            className="text-center text-red-600 dark:text-red-400"
          >
            No se pudo cargar el comprobante de esta compra.
          </p>
        ) : (
          <img
            src={imageUrl}
            alt="Vista previa"
            onError={() => setFailedUrl(imageUrl)}
            className="max-w-full max-h-[600px] object-contain rounded-xl border border-gray-300 dark:border-gray-700"
          />
        )}
      </div>
    </Modal>
  );
};

export default ImageModal;
