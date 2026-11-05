import Modal from "@/components/ui/Modal";
import { TicketType } from "@/utils/types";
import { FiCheckCircle, FiClock } from "react-icons/fi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  ticket: TicketType | null;
  onViewVoucher: (voucher: string) => void;
}

const Row = ({ label, value }: { label: string; value?: string | number }) => (
  <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-200 dark:border-gray-700/60 last:border-b-0">
    <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
    <span className="text-sm font-semibold text-gray-900 dark:text-white text-right truncate max-w-[220px]">
      {value ?? "—"}
    </span>
  </div>
);

export default function TicketDetailModal({
  isOpen,
  onClose,
  ticket,
  onViewVoucher,
}: Props) {
  if (!ticket) return null;

  const isApproved = Boolean(ticket.approved);
  const createdAt = ticket.createdAt
    ? new Date(ticket.createdAt).toLocaleString("es-ES", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : undefined;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalle del ticket" maxWidth="max-w-lg">
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isApproved
              ? "bg-success/15 text-green-600 dark:text-green-400"
              : "bg-yellow-400/15 text-yellow-600 dark:text-yellow-400"
          }`}
        >
          {isApproved ? <FiCheckCircle size={14} /> : <FiClock size={14} />}
          {isApproved ? "Aprobado" : "Pendiente"}
        </span>
      </div>

      <div>
        <Row label="Nombre" value={ticket.fullName} />
        <Row label="Correo" value={ticket.email} />
        <Row label="Teléfono" value={ticket.phone} />
        <Row label="Cantidad de tickets" value={ticket.numberTickets} />
        <Row label="Números asignados" value={ticket.approvalCodes?.join(", ")} />
        <Row label="Referencia" value={ticket.reference} />
        <Row label="Método de pago" value={ticket.paymentMethod} />
        <Row
          label="Monto pagado"
          value={
            ticket.amountPaid
              ? `${ticket.amountPaid.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}${
                  ticket.paymentMethod === "BDV" ? " Bs" : " $"
                }`
              : undefined
          }
        />
        {createdAt && <Row label="Fecha de compra" value={createdAt} />}
      </div>

      {ticket.voucher && (
        <button
          type="button"
          onClick={() => {
            onClose();
            onViewVoucher(ticket.voucher);
          }}
          className="mt-4 w-full text-sm font-semibold text-blue-600 dark:text-blue-300 hover:underline"
        >
          Ver comprobante de pago
        </button>
      )}
    </Modal>
  );
}
