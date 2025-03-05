import ImageSlider from "./Slider";

interface Props {
  name: string;
  description: string;
  images: string[];
  ticketPrice: number;
}
function HeaderPage({ name, description, images, ticketPrice }: Props) {
  return (
    <div className="flex flex-col w-full mx-auto justify-center items-center border-b border-gray-50 p-8 md:w-2/3">
      <div className="flex flex-col mb-6 text-center">
        <h1 className="text-4xl font-semibold">Bienvenido Futuro Ganador</h1>
        <h4 className="text-lg text-gray-200 font-bold">
          Estas a un Paso de Ganar con Denilson Bastidas
        </h4>
      </div>
      <div className="flex flex-col text-center mb-3">
        <p className="text-4xl font-semibold text-gray-100 mb-2">{name}</p>
        <p className="text-xl font-semibold text-gray-100 mb-2">
          {description}
        </p>
        <p className="text-xl font-medium text-blue-200">
          Por tan sólo {ticketPrice?.toString() || 0}$ por ticket.
        </p>
      </div>
      {/* slider */}
      <ImageSlider imagesSlider={images} />
    </div>
  );
}

export default HeaderPage;
