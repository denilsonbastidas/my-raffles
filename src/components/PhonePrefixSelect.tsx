import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface Country {
  code: string;
  name: string;
  dial: string;
}

const COUNTRIES: Country[] = [
  { code: "ve", name: "Venezuela", dial: "+58" },
  { code: "co", name: "Colombia", dial: "+57" },
  { code: "us", name: "Estados Unidos", dial: "+1" },
  { code: "mx", name: "México", dial: "+52" },
  { code: "ar", name: "Argentina", dial: "+54" },
  { code: "pe", name: "Perú", dial: "+51" },
  { code: "cl", name: "Chile", dial: "+56" },
  { code: "ec", name: "Ecuador", dial: "+593" },
  { code: "br", name: "Brasil", dial: "+55" },
  { code: "pa", name: "Panamá", dial: "+507" },
  { code: "do", name: "República Dominicana", dial: "+1" },
  { code: "bo", name: "Bolivia", dial: "+591" },
  { code: "py", name: "Paraguay", dial: "+595" },
  { code: "uy", name: "Uruguay", dial: "+598" },
  { code: "cr", name: "Costa Rica", dial: "+506" },
  { code: "gt", name: "Guatemala", dial: "+502" },
  { code: "hn", name: "Honduras", dial: "+504" },
  { code: "sv", name: "El Salvador", dial: "+503" },
  { code: "ni", name: "Nicaragua", dial: "+505" },
  { code: "cu", name: "Cuba", dial: "+53" },
  { code: "pr", name: "Puerto Rico", dial: "+1" },
];

interface Props {
  value: string;
  onChange: (dial: string) => void;
}

const flagUrl = (code: string) => `https://flagcdn.com/24x18/${code}.png`;

export default function PhonePrefixSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find((c) => c.dial === value) ?? COUNTRIES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 h-full px-3 py-3 rounded-l-xl border border-gray-600 border-r-0 bg-gray-900 text-white hover:bg-gray-800 transition"
      >
        <img
          src={flagUrl(selected.code)}
          alt={selected.name}
          className="w-5 h-[14px] rounded-sm object-cover"
        />
        <span className="text-sm font-semibold">{selected.dial}</span>
        <FiChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 top-full left-0 mt-1 w-60 max-h-64 overflow-y-auto rounded-xl border border-gray-700 bg-gray-900 shadow-2xl">
          {COUNTRIES.map((c) => (
            <button
              key={c.code + c.dial}
              type="button"
              onClick={() => {
                onChange(c.dial);
                setOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-800 text-left text-sm text-gray-200 transition"
            >
              <img
                src={flagUrl(c.code)}
                alt={c.name}
                className="w-5 h-[14px] rounded-sm object-cover shrink-0"
              />
              <span className="flex-1 truncate">{c.name}</span>
              <span className="text-gray-400">{c.dial}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
