import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  "https://picsum.photos/id/1015/800/500",
  "https://picsum.photos/id/1019/800/500",
  "https://picsum.photos/id/1020/800/500",
  "https://picsum.photos/id/1024/800/500",
];

export default function ImageSlider() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg overflow-hidden"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Slide ${index}`} className="w-full h-auto" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
