import { useEffect, useState } from "react";
import PaymentInfoCard from "./PaymentInfoCard";
import { banksData } from "@/utils/contants";

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
    <div className="flex flex-col items-center">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <span>🏦</span>{" "}
        <h3 className="text-3xl font-semibold">FORMA DE PAGO</h3>
      </h1>

      <div className="flex gap-4 mt-3">
        {banksData.map((bank) => (
          <button
            type="button"
            key={bank.bank}
            className="p-2 rounded-full w-14 h-14 flex justify-center items-center bg-white shadow-md"
            onClick={() => {
              setSelectedBank(bank);
              onSelectedBank(bank.type);
            }}
          >
            <img
              src={bank.logo}
              alt={bank.bank}
              className="w-10 h-10"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <div className="mt-4">
        <PaymentInfoCard
          {...selectedBank}
          totalBs={totalBs}
          totalUsd={totalUSD}
        />
      </div>
    </div>
  );
};

export default PaymentMethods;
