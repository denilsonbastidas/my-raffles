import { authentication } from "@/services";
import { fetchAuth } from "@/utils/auth";
import { ResponseAuthType } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiLock,
  FiArrowRight,
  FiTag,
  FiCheckCircle,
  FiBarChart2,
  FiDollarSign,
  FiShield,
} from "react-icons/fi";

const adminFeatures = [
  { icon: FiTag, text: "Gestiona y busca todos los tickets" },
  { icon: FiCheckCircle, text: "Aprueba o rechaza pagos al instante" },
  { icon: FiBarChart2, text: "Balance total y ranking de compradores" },
  { icon: FiDollarSign, text: "Actualiza la rifa y la tasa del dólar" },
];

function Admin() {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuth(navigate);
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setError("Ingresa tu token de acceso");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const responseAuth: ResponseAuthType = await authentication(token);
      localStorage.setItem("token", responseAuth.token);
      navigate("/admin/panel");
    } catch (error) {
      console.log(error);
      setError("Token inválido. Verifica e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900">
      {/* Panel informativo */}
      <div className="hidden md:flex relative md:w-1/2 flex-col justify-center px-8 py-12 md:p-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-10 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-md mx-auto md:mx-0">
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/logo.webp"
              alt="Rifas Denilson Bastidas"
              className="w-14 h-14 rounded-full border-2 border-yellow-400/70"
            />
            <div>
              <p className="text-white font-bebas text-2xl leading-none tracking-wide">
                Denilson Bastidas
              </p>
              <p className="text-blue-300 text-sm">Panel de Administración</p>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
            Controla tus rifas{" "}
            <span className="text-yellow-400">en un solo lugar</span>
          </h1>
          <p className="text-gray-400 mb-8">
            Administra ventas, valida pagos y consulta estadísticas en tiempo
            real.
          </p>

          <ul className="space-y-4">
            {adminFeatures.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-gray-200">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-500/15 text-blue-300">
                  <Icon size={18} />
                </span>
                <span className="text-sm md:text-base">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Formulario de acceso */}
      <div className="flex-1 md:w-1/2 flex items-center justify-center px-6 py-12 md:p-16 bg-gray-50">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center text-center mb-8 md:hidden">
            <img
              src="/logo.webp"
              alt="Rifas Denilson Bastidas"
              className="w-16 h-16 rounded-full border-2 border-yellow-400 mb-3"
            />
          </div>

          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-yellow-400 mb-5">
            <FiLock size={22} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Iniciar sesión</h2>
          <p className="text-gray-500 mb-8 mt-1">
            Ingresa tu token para acceder al panel.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="token"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Token de acceso
              </label>
              <div className="relative">
                <FiLock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  id="token"
                  type="password"
                  placeholder="••••••••••••"
                  value={token}
                  onChange={(e) => {
                    setToken(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 active:scale-[0.99] disabled:opacity-60 transition"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar al panel
                  <FiArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-gray-400">
            <FiShield size={14} />
            Acceso seguro y encriptado
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
