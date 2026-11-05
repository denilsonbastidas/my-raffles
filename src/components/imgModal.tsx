import React from "react";
import Modal from "@/components/ui/Modal";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <Modal isOpen onClose={onClose} title="Voucher de compra" maxWidth="max-w-xl">
      <div className="flex justify-center">
        <img
          src={imageUrl.split("uploads/")[1]}
          alt="Vista previa"
          className="max-h-[600px] object-contain rounded-xl border border-gray-300 dark:border-gray-700"
        />
      </div>
    </Modal>
  );
};

export default ImageModal;
