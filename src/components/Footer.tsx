import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { FiShield, FiLock, FiCheckCircle } from "react-icons/fi";

const socials = [
  {
    href: "https://www.facebook.com/profile.php?id=61573705346985",
    icon: FaFacebookF,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/denilsonbastidas",
    icon: FaInstagram,
    label: "Instagram",
  },
  {
    href: "https://www.tiktok.com/@denilsonbastidas_",
    icon: FaTiktok,
    label: "TikTok",
  },
];

const badges = [
  { icon: FiLock, text: "Pagos Seguros" },
  { icon: FiShield, text: "SSL Encriptado" },
  { icon: FiCheckCircle, text: "Verificado" },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0d1424] to-[#05070c] text-white border-t border-white/10">
      <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col items-center text-center">
        <p className="font-anton uppercase text-lg md:text-xl tracking-wide bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-6">
          El que no juega, no gana
        </p>
        <img
          src="/logo.webp"
          alt="Rifas Denilson Bastidas"
          className="w-16 h-16 rounded-full border-2 border-yellow-400/70 mb-3"
        />
        <p className="font-bebas text-2xl tracking-wide">Denilson Bastidas</p>
        <p className="text-gray-400 text-sm max-w-md mt-1">
          La plataforma más segura y transparente para participar en nuestras
          rifas online.
        </p>

        <div className="flex items-center gap-3 mt-5">
          {socials.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 hover:bg-yellow-400 hover:text-gray-900 text-white transition-colors duration-200"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-7">
          {badges.map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="flex items-center gap-1.5 text-xs text-gray-400"
            >
              <Icon size={14} className="text-blue-300" />
              {text}
            </span>
          ))}
        </div>

        <div className="w-full border-t border-gray-700 mt-8 pt-5 text-xs text-gray-500">
          © {new Date().getFullYear()} Rifas Denilson Bastidas · Gracias por
          confiar en nosotros.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
