import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className="bg-gray-800  text-white text-center p-4">
      <p className="text-sm">© Rifas Denilson Bastidas</p>

      <div className="flex justify-center gap-4 my-3">
        <a
          href="https://www.facebook.com/denilsonmcgrady"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white rounded-full p-3"
        >
          <FaFacebookF size={20} />
        </a>
        <a
          href="https://www.instagram.com/denilsonbastidas"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-red-600 text-white rounded-full p-3"
        >
          <FaInstagram size={20} />
        </a>
        <a
          href="https://www.tiktok.com/@denilsonbastidas_"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white rounded-full p-3"
        >
          <FaTiktok size={20} />
        </a>
      </div>

      <p className="text-sm">Gracias por Confiar en Nosotros.</p>
    </footer>
  );
};

export default Footer;
