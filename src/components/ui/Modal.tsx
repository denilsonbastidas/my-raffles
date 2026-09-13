import { ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

// Shared modal shell — every admin dialog uses the same surface, header and close button.
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-lg",
}: Props) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto bg-white border border-gray-200 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 rounded-2xl shadow-2xl p-6 md:p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
        >
          <FiX size={22} />
        </button>

        {title && (
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pr-8">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
}
