import { useEffect, useState } from "react";
import PaymentInfoCard from "./PaymentInfoCard";
import { banksData } from "@/utils/contants";
import { FiCreditCard, FiCheck } from "react-icons/fi";

interface Props {
  totalUSD: number;
  totalBs: number;
  onSelectedBank: (type: string) => void;
}
const PaymentMethods = ({ totalBs, totalUSD, onSelectedBank }: Props) => {
  const [selectedBank, setSelectedBank] = useState(banksData[0]);

  useEffect(() => {
    onSelectedBank(banksData[0].type);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-500/15 text-blue-300 shrink-0">
          <FiCreditCard size={18} />
        </span>
        <div>
          <h3 className="text-base font-bold text-white leading-tight">
            Forma de pago
          </h3>
          <p className="text-xs text-gray-400">
            Selecciona tu método preferido
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        {banksData.map((bank) => {
          const isSelected = selectedBank.type === bank.type;
          return (
            <button
              type="button"
              key={bank.bank}
              onClick={() => {
                setSelectedBank(bank);
                onSelectedBank(bank.type);
              }}
              className={`relative flex-1 min-w-[110px] flex flex-col items-center gap-2 rounded-2xl border p-3 transition ${
                isSelected
                  ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/40"
                  : "border-gray-700 bg-gray-900/40 hover:border-gray-600"
              }`}
            >
              {isSelected && (
                <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-blue-500">
                  <FiCheck size={10} className="text-white" />
                </span>
              )}
              <img
                src={bank.logo}
                alt={bank.bank}
                className="w-10 h-10 rounded-full bg-white p-1"
                loading="lazy"
              />
              <span className="text-xs font-semibold text-gray-200">
                {bank.bank}
              </span>
            </button>
          );
        })}
      </div>

      <PaymentInfoCard
        {...selectedBank}
        totalBs={totalBs}
        totalUsd={totalUSD}
      />
    </div>
  );
};

export default PaymentMethods;
