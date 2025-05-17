import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  imagesSlider: string[];
}

export default function ImageSlider({ imagesSlider }: Props) {
  return (
    <div className="w-full max-w-3xl mx-auto relative">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="rounded-xl shadow-lg overflow-hidden"
      >
        {imagesSlider?.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src.split("uploads/")[1]}
              alt={`Slide ${index}`}
              className="w-full h-[500px] object-cover md:object-contain mx-auto bg-black"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
