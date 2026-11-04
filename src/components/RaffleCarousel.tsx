import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y } from "swiper/modules";
import { RaffleRecord } from "@/utils/types";
import "swiper/css";
import "swiper/css/navigation";

export default function RaffleCarousel({
  raffles,
  title,
}: {
  raffles: RaffleRecord[];
  title: string;
}) {
  if (!raffles.length) return null;
  return (
    <section
      className="relative z-10 max-w-6xl w-full mx-auto px-6 py-12 text-white"
      aria-label={title}
    >
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <Swiper
        modules={[Navigation, A11y]}
        navigation
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
      >
        {raffles.map((raffle) => (
          <SwiperSlide key={raffle._id}>
            <Link
              to={`/rifas/${raffle._id}`}
              className="block rounded-2xl overflow-hidden border border-white/15 bg-slate-900"
            >
              {raffle.images[0] && (
                <img
                  src={raffle.images[0]}
                  alt={raffle.name}
                  loading="lazy"
                  className="h-52 w-full object-cover"
                />
              )}
              <div className="p-5">
                <p className="text-sm text-blue-300">
                  {raffle.status === "closed"
                    ? "Rifa cerrada · Solo consulta"
                    : "Rifa activa"}
                </p>
                <h3 className="text-xl font-bold mt-2">{raffle.name}</h3>
                <p className="text-gray-400 mt-2 line-clamp-2">
                  {raffle.description}
                </p>
                <p className="mt-4 font-semibold">
                  Ver rifa y consultar números →
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
