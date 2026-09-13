import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

interface Props {
  type: string;
  bank: string;
  logo: string;
  bdv?: string;
  phone?: string;
  indentifyBdv?: string;
  email?: string;
  nameZelle?: string;
  totalUsd: number;
  totalBs: number;
}

const PaymentInfoCard = ({
  bank,
  logo,
  bdv,
  phone,
  indentifyBdv,
  email,
  nameZelle,
  totalUsd,
  totalBs,
  type,
}: Props) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField((current) => (current === field ? null : current));
    }, 1500);
  };

  const Row = ({
    label,
    value,
    field,
  }: {
    label: string;
    value?: string;
    field: string;
  }) => (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-gray-700/60 last:border-b-0">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-semibold text-white truncate">
          {value}
        </span>
        <button
          type="button"
          onClick={() => copyToClipboard(value ?? "", field)}
          className="shrink-0 text-gray-400 hover:text-blue-300 transition"
          aria-label={`Copiar ${label}`}
        >
          {copiedField === field ? (
            <FiCheck size={16} className="text-success" />
          ) : (
            <FiCopy size={16} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-5 w-full max-w-sm mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={logo}
          alt={bank}
          className="w-12 h-12 rounded-full bg-white p-1 shrink-0"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-gray-400">
            Pagar con
          </p>
          <p className="text-base font-bold text-white truncate">{bank}</p>
        </div>
      </div>

      <div className="mt-2">
        {type === "BDV" && (
          <>
            <Row label="Banco" value={bdv} field="bdv" />
            <Row label="Teléfono" value={phone} field="phone" />
            <Row label="Cédula de identidad" value={indentifyBdv} field="cedula" />
          </>
        )}

        {type === "binance" && <Row label="Email" value={email} field="email" />}

        {type === "zelle" && (
          <>
            <Row label="Teléfono" value={email} field="zellePhone" />
            <Row label="Nombre" value={nameZelle} field="zelleName" />
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
        <span className="text-sm text-gray-300">Total a pagar</span>
        <span className="text-xl font-extrabold text-blue-300">
          {type === "BDV"
            ? `${totalBs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Bs`
            : `${totalUsd} $`}
        </span>
      </div>
    </div>
  );
};

export default PaymentInfoCard;
