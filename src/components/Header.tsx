import ImageSlider from "./Slider";
import { FiSearch, FiShoppingCart, FiPieChart } from "react-icons/fi";
import { FaInstagram, FaTiktok } from "react-icons/fa";

interface Props {
  name: string;
  description: string;
  images: string[];
  ticketPrice: number;
  availabilityPercent: number;
  onBuyClick: () => void;
  onVerifyClick: () => void;
}
// function HeaderPage({ name, description, images, ticketPrice }: Props) {

function HeaderPage({
  name,
  description,
  images,
  ticketPrice,
  availabilityPercent,
  onBuyClick,
  onVerifyClick,
}: Props) {
  const displayPrice = ticketPrice > 0 ? `${ticketPrice}$` : "15bs";

  return (
    <>
      {/* Barra superior sticky */}
      <header className="sticky top-0 z-30 bg-[#0b1220]/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 sm:flex-row sm:justify-between px-4 md:px-6 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.webp"
              alt="logo denilson bastidas"
              className="w-11 h-11 rounded-full border-2 border-yellow-400/70"
              loading="lazy"
            />
            <div className="leading-tight text-center sm:text-left">
              <p className="font-bebas text-xl md:text-2xl tracking-wide text-white">
                Denilson Bastidas
              </p>
              <p className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] uppercase tracking-wider text-blue-300">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
                Eventos Oficiales
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <a
              href="https://www.instagram.com/denilsonbastidas"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 text-white inline-flex items-center justify-center transition"
              aria-label="Instagram"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href="https://www.tiktok.com/@denilsonbastidas_"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 hover:bg-white/15 text-white inline-flex items-center justify-center transition"
              aria-label="TikTok"
            >
              <FaTiktok size={15} />
            </a>
            <button
              type="button"
              onClick={onVerifyClick}
              className="px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition"
            >
              <FiSearch size={16} /> Consultar Números
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="w-full pt-14 pb-16 md:pt-20 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <ImageSlider imagesSlider={images} />
            </div>

            <div className="flex flex-col text-center lg:text-left">
              <p className="text-4xl md:text-6xl uppercase font-bebas font-bold text-white mb-1 leading-none">
                {name}
              </p>
              <p className="text-lg md:text-2xl uppercase font-bebas font-semibold text-gray-300 mb-3">
                {description}
              </p>
              <p className="text-lg md:text-xl font-anton uppercase font-semibold text-blue-300 mb-5">
                Por tan solo <span className="text-yellow-400">{displayPrice}</span>{" "}
                por ticket.
              </p>

              <div className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 mb-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300">
                      <FiPieChart size={14} />
                    </span>
                    Disponibilidad
                  </span>
                  <span className="text-lg font-extrabold text-blue-300">
                    {availabilityPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-300 transition-all duration-700 ease-out"
                    style={{ width: `${availabilityPercent}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onBuyClick}
                className="relative overflow-hidden flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl text-base font-bold text-gray-900 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 shadow-md shadow-yellow-500/30 hover:shadow-yellow-500/50 animate-floatY transition-shadow duration-200"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-full shine-sweep bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                <FiShoppingCart className="relative text-lg" />
                <span className="relative">Comprar Número</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HeaderPage;
