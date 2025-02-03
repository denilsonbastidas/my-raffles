import { LuClipboard } from "react-icons/lu";

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
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copiado: ${text}`);
  };

  return (
    <div className="bg-blue-700 text-white rounded-2xl p-6 max-w-lg w-[350px] text-center shadow-lg">
      <h2 className="text-lg font-semibold">Modo de Pago</h2>
      <p className="text-sm mb-2">{bank}</p>

      <div className="flex justify-center items-center my-2">
        <img src={logo} alt={bank} className="w-12 h-12 rounded-full" />
      </div>

      {type === "venezuela" ? (
        <div className="text-center space-y-2">
          <p className="flex gap-2 items-center">
            <span className="font-bold">BDV:</span> {bdv}
            <LuClipboard
              className="w-5 h-5 cursor-pointer"
              onClick={() => copyToClipboard(bdv ?? "")}
            />
          </p>
          <p className="flex gap-2 items-center">
            <span className="font-bold">Teléfono:</span> {phone}
            <LuClipboard
              className="w-5 h-5 cursor-pointer"
              onClick={() => copyToClipboard(phone ?? "")}
            />
          </p>
          <p className="flex gap-2 items-center">
            <span className="font-bold">Cédula de Identidad:</span>{" "}
            {indentifyBdv}
            <LuClipboard
              className="w-5 h-5 cursor-pointer"
              onClick={() => copyToClipboard(indentifyBdv ?? "")}
            />
          </p>
        </div>
      ) : null}

      {type === "binance" ? (
        <div className="text-center space-y-2">
          <p className="flex gap-2 items-center">
            <span className="font-bold">Email:</span> {email}
            <LuClipboard
              className="w-5 h-5 cursor-pointer"
              onClick={() => copyToClipboard(email ?? "")}
            />
          </p>
        </div>
      ) : null}

      {type === "zelle" ? (
        <div className="text-center space-y-2">
          <p className="flex gap-2 items-center">
            <span className="font-bold">Email:</span> {email}
            <LuClipboard
              className="w-5 h-5 cursor-pointer"
              onClick={() => copyToClipboard(email ?? "")}
            />
          </p>

          <p className="flex gap-2 items-center">
            <span className="font-bold">Nombre:</span> {nameZelle}
            <LuClipboard
              className="w-5 h-5 cursor-pointer"
              onClick={() => copyToClipboard(nameZelle ?? "")}
            />
          </p>
        </div>
      ) : null}
      <h3 className="mt-4 text-lg font-bold">Total a Pagar:</h3>
      {type === "venezuela" ? (
        <p className="text-2xl font-bold">{totalBs} Bs.</p>
      ) : null}

      {type === "zelle" ? (
        <p className="text-2xl font-bold">{totalUsd} $ USD</p>
      ) : null}

      {type === "binance" ? (
        <p className="text-2xl font-bold">{totalUsd} $ USDT</p>
      ) : null}
    </div>
  );
};

export default PaymentInfoCard;
