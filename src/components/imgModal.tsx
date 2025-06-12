import React from "react";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 text-3xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
          Voucher de compra
        </h2>
        <div className="flex justify-center">
          <img
            src={imageUrl.split("uploads/")[1]}
            alt="Vista previa"
            className="w-70 max-h-[600px] object-cover rounded-xl border-4 border-gray-300"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
