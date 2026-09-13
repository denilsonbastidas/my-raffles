import { useState } from "react";
import {
  FiX,
  FiMail,
  FiSearch,
  FiCheckCircle,
} from "react-icons/fi";
import { FaTicketAlt } from "react-icons/fa";
import { checkApprovedTickets } from "@/services";

interface ConsultResult {
  nombre: string;
  email: string;
  tickets: (string | number)[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  whatsappUrl: string;
  phoneSupport: string;
}

const ConsultModal = ({ isOpen, onClose, whatsappUrl, phoneSupport }: Props) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<ConsultResult[] | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail("");
    setError("");
    setResults(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) {
      setError("Ingresa un correo electrónico válido");
      return;
    }
    setError("");
    setLoading(true);
    setResults(null);
    try {
      const response = await checkApprovedTickets(email);
      if (!response || response.length === 0) {
        setError("No se encontraron tickets aprobados con ese correo");
      } else {
        setResults(response);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message || "Error al verificar los tickets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-gradient-to-b from-gray-900 to-black border border-gray-700 rounded-3xl p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
          aria-label="Cerrar"
        >
          <FiX size={22} />
        </button>

        <div className="flex flex-col items-center text-center">
          <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30 mb-4">
            <FaTicketAlt size={26} />
          </span>
          <h2 className="text-xl font-bold text-white">
            Consulta tus Números
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Verifica el estado de tus tickets al instante con tu correo
            electrónico.
          </p>

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/15 border border-blue-500/40 text-blue-300 text-sm font-semibold mt-5">
            <FiMail size={16} /> Por correo electrónico
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="relative">
            <FiMail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="tucorreo@gmail.com"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white outline-none focus:border-blue-400 transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 mt-3 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold disabled:opacity-60 transition"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiSearch size={18} /> Consultar
              </>
            )}
          </button>
        </form>

        {results && (
          <div className="mt-5 space-y-3">
            {results.map((r, i) => (
              <div
                key={i}
                className="bg-gray-800/70 border border-gray-700 rounded-xl p-4"
              >
                <div className="flex items-center gap-2 text-blue-300 font-semibold">
                  <FiCheckCircle /> {r.nombre}
                </div>
                <p className="text-xs text-gray-400 mb-2">{r.email}</p>
                <div className="flex flex-wrap gap-2">
                  {r.tickets.map((t, j) => (
                    <span
                      key={j}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-200 text-sm font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-500 mt-6">
          ¿Problemas para encontrar tus tickets?{" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300 underline"
          >
            Contáctanos por WhatsApp {phoneSupport}
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConsultModal;
