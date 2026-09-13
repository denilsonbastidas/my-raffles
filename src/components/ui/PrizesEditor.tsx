import { FiPlus, FiTrash2, FiGift } from "react-icons/fi";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { PrizeType } from "@/utils/types";

interface Props {
  prizes: PrizeType[];
  onChange: (prizes: PrizeType[]) => void;
}

// Extracts a numeric money value from strings like "$50" or "50"; ignores non-money prizes (e.g. "Un iPhone 15").
const parseMoney = (value: string) => {
  const match = value.match(/[\d.,]+/);
  if (!match) return 0;
  const num = parseFloat(match[0].replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
};

export default function PrizesEditor({ prizes, onChange }: Props) {
  const updatePrize = (index: number, field: keyof PrizeType, value: string) => {
    const next = prizes.map((prize, i) =>
      i === index ? { ...prize, [field]: value } : prize,
    );
    onChange(next);
  };

  const addPrize = () => onChange([...prizes, { title: "", amount: "" }]);
  const removePrize = (index: number) =>
    onChange(prizes.filter((_, i) => i !== index));

  const total = prizes.reduce((sum, prize) => sum + parseMoney(prize.amount), 0);

  return (
    <div className="bg-gray-100 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 md:p-5">
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 shrink-0">
            <FiGift size={18} />
          </span>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Premios</p>
            <p className="text-xs text-gray-500">
              Se muestran en la página pública
            </p>
          </div>
        </div>
        <Button type="button" variant="secondary" size="sm" icon={<FiPlus size={14} />} onClick={addPrize}>
          Agregar
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-3 mb-3">
        Usa un monto ($50) o un premio físico (Un iPhone 15). El "Total a
        repartir" se calcula sumando los montos en dinero.
      </p>

      {prizes.length === 0 ? (
        <div className="flex flex-col items-center text-center py-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
          <FiGift size={22} className="text-gray-400 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Aún no hay premios agregados.</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
            Haz clic en "Agregar" para crear el primero.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {prizes.map((prize, index) => (
            <div
              key={index}
              className="flex items-start gap-2 bg-white dark:bg-black/20 border border-gray-200 dark:border-gray-700/70 rounded-xl p-3"
            >
              <span className="flex items-center justify-center w-6 h-6 mt-1 rounded-full bg-gray-200 dark:bg-gray-700 text-[11px] font-bold text-gray-700 dark:text-gray-200 shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Input
                  placeholder="Ej: Premio Mayor"
                  value={prize.title}
                  onChange={(e) => updatePrize(index, "title", e.target.value)}
                />
                <Input
                  placeholder="Ej: $50 o Un iPhone 15"
                  value={prize.amount}
                  onChange={(e) => updatePrize(index, "amount", e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removePrize(index)}
                aria-label="Quitar premio"
                className="mt-1 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-danger/80 transition shrink-0"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {total > 0 && (
        <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Total a repartir (calculado)
          </span>
          <span className="text-lg font-extrabold text-blue-600 dark:text-blue-300">
            ${total.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}

