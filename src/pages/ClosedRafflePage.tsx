import { useState } from "react";
import { Link } from "react-router-dom";
import { RaffleType } from "@/utils/types";
import ImageSlider from "@/components/Slider";
import Footer from "@/components/Footer";
import ConsultModal from "@/components/ConsultModal";
import { PHONE_SUPPORT } from "@/utils/contants";

export default function ClosedRafflePage({ raffle }: { raffle: RaffleType }) {
  const [consulting, setConsulting] = useState(false);
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      <main className="max-w-5xl w-full mx-auto px-6 py-12 flex-1">
        <Link to="/" className="text-blue-300">
          ← Volver al inicio
        </Link>
        <p className="mt-8 text-amber-300 font-semibold">
          Rifa cerrada · Solo consulta
        </p>
        <h1 className="text-4xl font-bold mt-3 mb-8">{raffle.name}</h1>
        {raffle.images.length > 0 && (
          <ImageSlider imagesSlider={raffle.images} />
        )}
        <p className="my-6 whitespace-pre-line text-gray-300">
          {raffle.description}
        </p>
        {raffle.closedAt && (
          <p>
            Cerrada el {new Date(raffle.closedAt).toLocaleDateString("es-VE")}
          </p>
        )}
        <p className="mt-3">
          Precio del boleto: ${raffle.ticketPrice} · Números vendidos:{" "}
          {raffle.totalSold ?? 0}
        </p>
        <ul className="my-6 space-y-3">
          {raffle.prizes?.map((prize, index) => (
            <li key={index}>
              <strong>{prize.title}:</strong> {prize.amount}
            </li>
          ))}
        </ul>
        <p className="text-gray-400 mb-5">
          Esta rifa ya no acepta compras. Puedes consultar los números de tus
          compras aprobadas.
        </p>
        <button
          onClick={() => setConsulting(true)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold"
        >
          Consultar mis números
        </button>
      </main>
      <Footer />
      <ConsultModal
        raffleId={raffle._id || ""}
        isOpen={consulting}
        onClose={() => setConsulting(false)}
        whatsappUrl={`https://wa.me/${PHONE_SUPPORT.replace(/\D/g, "")}`}
        phoneSupport={PHONE_SUPPORT}
      />
    </div>
  );
}
