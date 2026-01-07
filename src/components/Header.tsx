import ImageSlider from "./Slider";

interface Props {
  name: string;
  description: string;
  images: string[];
  ticketPrice: number;
}
function HeaderPage({ name, description, images, ticketPrice }: Props) {
  return (
    <div className="flex flex-col w-full mx-auto justify-center items-center border-b border-gray-700 p-8 md:w-2/3 bg-gradient-to-b from-gray-900 to-black rounded-b-3xl shadow-lg">
      <div className="py-2 mb-2 mx-auto">
        <img
          src="logo.webp"
          alt="logo denilson bastidas"
          className="w-28 h-28 border-2 rounded-full"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col text-center mb-6">
        <p className="text-5xl md:text-6xl uppercase font-bebas font-bold text-white mb-2">
          {name}
        </p>
        <p className="text-xl md:text-2xl uppercase font-bebas font-semibold text-gray-300 mb-2">
          {description}
        </p>
        {/* el que va en realidad */}
        <p className="text-xl font-anton uppercase hidden font-semibold text-blue-300">
          Por tan solo <span className="text-yellow-400">{ticketPrice}$</span>{" "}
          por ticket.
        </p>

        <p className="text-xl font-anton uppercase font-semibold text-blue-300">
          Por tan solo <span className="text-yellow-400">100bs</span> por
          ticket.
        </p>
      </div>

      {/* Slider */}
      <ImageSlider imagesSlider={images} />
    </div>
  );
}

export default HeaderPage;
