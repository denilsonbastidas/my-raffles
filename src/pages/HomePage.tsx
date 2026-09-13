import Footer from "@/components/Footer";
import HeaderPage from "@/components/Header";
import PaymentMethods from "@/components/PaymentMethods";
import ConsultModal from "@/components/ConsultModal";
import PhonePrefixSelect from "@/components/PhonePrefixSelect";
import {
  getParallelDollar,
  getRaffle,
  submitTicket,
} from "@/services";
import { RaffleType } from "@/utils/types";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { swal, swalSuccess } from "@/utils/swal";
import * as Yup from "yup";
import {
  FiUploadCloud,
  FiAward,
  FiStar,
  FiGift,
  FiShoppingBag,
  FiUser,
  FiMail,
  FiHash,
  FiXCircle,
  FiMinus,
  FiPlus,
  FiAlertTriangle,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { PHONE_SUPPORT } from "@/utils/contants";

const TOTAL_TICKETS = 10000;

// Extracts a numeric money value from strings like "$50"; ignores non-money prizes (e.g. "Un iPhone 15").
const parseMoney = (value: string) => {
  const match = value.match(/[\d.,]+/);
  if (!match) return 0;
  const num = parseFloat(match[0].replace(/,/g, ""));
  return isNaN(num) ? 0 : num;
};


const PROMO_MESSAGES = [
  "Compra ahora y participa por premios reales",
  "No pierdas la oportunidad, tu número puede ser el ganador",
  "Paga seguro y recibe tus tickets por correo",
  "Tus números te esperan, participa hoy",
  "La suerte cambia en un click",
];

function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const buySectionRef = useRef<HTMLDivElement>(null);
  const MAX_VALUE = 200;
  const predefinedValues = [2, 5, 10, 20, 50, 100, 200];
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const whatsappUrl = `https://wa.me/${PHONE_SUPPORT.replace(/\D/g, "")}`;
  const [preview, setPreview] = useState<string | null>(null);

  const [raffleActually, setRaffleActually] = useState<RaffleType>({
    name: "",
    description: "",
    images: [""],
    ticketPrice: "",
    visible: false,
    minValue: 0,
  });

  const [disponibleTickets, setDisponibleTickets] = useState<number>(0);
  const [disponibleWithNoAproved, setDisponibleWithNoAproved] =
    useState<number>(0);
  const [alertaTickets, setAlertaTickets] = useState<string>("");
  const [exchangeRateVzla, setExchangeRateVzla] = useState<number>(0);

  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBS, setTotalBS] = useState(0);
  const [selectedBank, setSelectedBank] = useState<string>();

  const [showIGOverlay, setShowIGOverlay] = useState(false);
  const [count, setCount] = useState(4);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [phonePrefix, setPhonePrefix] = useState("+58");
  const [phoneNumber, setPhoneNumber] = useState("");

  const isInstagramBrowser = () => {
    const ua = navigator.userAgent || "";
    const params = new URLSearchParams(window.location.search);
    if (params.get("igtest") === "1") return true;
    return /Instagram/i.test(ua);
  };

  const isIOS = () => /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = () => /Android/i.test(navigator.userAgent);

  const openInExternalBrowser = () => {
    const url = window.location.href;
    const cleanUrl = url.replace(/^https?:\/\//, "");

    if (isIOS()) {
      attemptOpen(`safari-https://${cleanUrl}`);

      setTimeout(() => {
        attemptOpen(`googlechrome://${cleanUrl}`);
      }, 300);

      setTimeout(() => {
        attemptOpen(`firefox://open-url?url=${encodeURIComponent(url)}`);
      }, 600);

      setTimeout(() => {
        window.location.replace(url);
      }, 900);

      return;
    }

    if (isAndroid()) {
      window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;

      setTimeout(() => {
        window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=org.mozilla.firefox;end`;
      }, 1000);

      setTimeout(() => {
        window.location.href = url;
      }, 2000);

      return;
    }

    window.open(url, "_blank");
  };

  const attemptOpen = (schemeUrl: string): boolean => {
    try {
      window.location.href = schemeUrl;
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!isInstagramBrowser()) return;

    setShowIGOverlay(true);

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      openInExternalBrowser();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    formik.setFieldValue("paymentMethod", selectedBank);
    if (selectedBank === "binance" || selectedBank === "zelle") {
      formik.setFieldValue("amountPaid", totalUSD);
      return;
    }
    formik.setFieldValue("amountPaid", totalBS);
  }, [selectedBank]);

  useEffect(() => {
    formik.setFieldValue("phone", phoneNumber ? `${phonePrefix}${phoneNumber}` : "");
  }, [phonePrefix, phoneNumber]);

  useEffect(() => {
    const fetchParallelDollar = async () => {
      const responseParallelDollar = await getParallelDollar();
      setExchangeRateVzla(responseParallelDollar?.priceEnparalelovzla);
    };
    fetchParallelDollar();
  }, []);

  useEffect(() => {
    const fetchGetRaffle = async () => {
      try {
        const responseRaffle = await getRaffle();
        setRaffleActually(responseRaffle[0]);

        const minValue = parseInt(responseRaffle[0]?.minValue);
        formik.setFieldValue("numberTickets", minValue);
        setDisponibleTickets(10000 - responseRaffle.totalSold);
        setDisponibleWithNoAproved(
          10000 - responseRaffle.totalSoldWithNoAproved,
        );
        updateTotal(minValue);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGetRaffle();
  }, []);

  useEffect(() => {
    updateTotal(raffleActually.minValue);
  }, [raffleActually]);

  const updateTotal = (quantity: number) => {
    let totalUSD = quantity * parseFloat(raffleActually?.ticketPrice);
    let totalBS = totalUSD * exchangeRateVzla;

    totalUSD = Math.round(totalUSD * 10) / 10;
    totalBS = Math.round(totalBS * 10) / 10;

    setTotalUSD(totalUSD);
    setTotalBS(totalBS);

    if (selectedBank === "binance" || selectedBank === "zelle") {
      formik.setFieldValue("amountPaid", totalUSD);
      return;
    }
    formik.setFieldValue("amountPaid", totalBS);
  };

  const formik = useFormik({
    initialValues: {
      numberTickets: "",
      fullName: "",
      email: "",
      phone: "",
      paymentMethod: selectedBank,
      amountPaid: "",
      reference: "",
      voucher: "",
    },
    validationSchema: Yup.object({
      numberTickets: Yup.number()
        .max(MAX_VALUE, `No puede seleccionar más de ${MAX_VALUE} números`)
        .required("Este campo es obligatorio"),
      fullName: Yup.string().required("Este campo es obligatorio"),
      email: Yup.string()
        .email("Debe ser un correo válido")
        .required("Este campo es obligatorio"),
      phone: Yup.string().required("Este campo es obligatorio"),
      reference: Yup.string().required("Este campo es obligatorio"),
      voucher: Yup.string().required("Debe subir un comprobante de pago"),
    }),

    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);

      try {
        values.paymentMethod = selectedBank;

        await submitTicket(values);

        swalSuccess.fire({
          title: "¡Gracias por realizar tu compra!🎉",
          html: `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; width: 100%; padding: 8px;  margin: auto; border-radius: 12px; background-color: #1f2937; color: #e5e7eb; text-align: center;">

    <p style="color: #9ca3af; font-size: 0.95rem;">
      Una vez confirmado tu pago, recibirás tus tickets en tu correo electrónico.
    </p>

    <div style="margin-top: 1.5rem; background: #111827; padding: 1rem; border-radius: 10px; text-align: left; font-size: 0.95rem; color: #e5e7eb;">
      <h3 style="color: #ffffff; margin-bottom: 1rem; text-align: center;">📌 Detalles de tu compra:</h3>

      <!-- Contenedor de datos responsivo -->
      <div style="display: flex; flex-direction: column; gap: 0.5rem; word-break: break-word;">

        <div style="white-space: normal; word-wrap: break-word;"> <strong>Nombre:</strong> <span style="display: inline-block;">${values.fullName}</span></div>
        <div style="white-space: normal; word-wrap: break-word;"><strong>Email:</strong> <span style="display: inline-block;">${values.email}</span></div>
        <div><strong>Teléfono:</strong> ${values.phone}</div>
        <div><strong>Boletos comprados:</strong> ${values.numberTickets}</div>
        <div><strong>Método de pago:</strong> ${values.paymentMethod}</div>
        <div><strong>Referencia:</strong> ${values.reference}</div>
        <div><strong>Monto pagado:</strong> ${values.amountPaid}${values.paymentMethod === "BDV" ? " Bs" : " $"}</div>

      </div>
    </div>

    <!-- Comprobante -->
    <div style="margin-top: 2rem; text-align: center;">
    <h3 style="font-size: 1rem; color: #d1d5db; margin-bottom: 0.5rem;"><strong>🧾 Comprobante de pago:</strong></h3>
    <img src="${values.voucher}" alt="Comprobante de pago" style="max-width: 100%; height: auto; border-radius: 8px; margin: auto;" />
    </div>
    <!-- Nota final -->
    <p style="margin-top: 2rem; font-size: 0.90rem; color: #9ca3af;">
      ⏳ <strong>Recuerda:</strong> debes esperar entre 24 y 36 horas mientras verificamos tu compra.<br />
      Luego, recibirás tus tickets en tu correo electronico <strong>${values.email}</strong>.
    </p>

    <p style="margin-top: 2rem; font-size: 0.95rem; color: #d1d5db;">
      <strong>Saludos,</strong><br />Equipo de Denilson Bastidas
    </p>
  </div>
`,
          icon: "success",
          showConfirmButton: true,
          confirmButtonText: "Aceptar",
          width: 700,
        });

        resetForm();
        setTotalUSD(0);
        setTotalBS(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          setPreview(null);
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);

        swal.fire({
          title: "Error",
          text: "Hubo un problema con tu compra. Inténtalo nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          let width = img.width;
          let height = img.height;

          if (width > 600 || height > 600) {
            const aspectRatio = width / height;
            if (width > height) {
              width = 600;
              height = Math.round(600 / aspectRatio);
            } else {
              height = 600;
              width = Math.round(600 * aspectRatio);
            }
          }

          canvas.width = width;
          canvas.height = height;

          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const base64String = canvas.toDataURL("image/jpeg", 0.8);
            resolve(base64String);
          } else {
            reject(new Error("No se pudo obtener el contexto del canvas."));
          }
        };

        img.onerror = (error) => reject(error);
      };

      reader.onerror = (error) => reject(error);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    if (rawValue === "") {
      formik.setFieldValue("numberTickets", "");
      setTotalUSD(0);
      setTotalBS(0);
      setAlertaTickets("");
      return;
    }

    if (/^\d+$/.test(rawValue)) {
      let value = parseInt(rawValue, 10);

      if (value > MAX_VALUE) value = MAX_VALUE;

      if (value > disponibleTickets) {
        value = disponibleTickets;
        setAlertaTickets(
          `Solo quedan ${disponibleTickets} tickets disponibles`,
        );
      } else {
        setAlertaTickets("");
      }

      formik.setFieldValue("numberTickets", value);
      updateTotal(value);
    }
  };

  const handlePredefinedSelection = (value: number) => {
    let finalValue = value;

    if (value > disponibleTickets) {
      finalValue = disponibleTickets;
      setAlertaTickets(`Solo quedan ${disponibleTickets} tickets disponibles`);
    } else {
      setAlertaTickets("");
    }

    formik.setFieldValue("numberTickets", finalValue);
    inputRef.current?.focus();
    updateTotal(finalValue);
  };

  const handleTicketChange = (newValue: number) => {
    const min = raffleActually?.minValue ?? 1;
    let finalValue = newValue;

    if (finalValue < min) {
      finalValue = min;
    }

    if (finalValue > MAX_VALUE) {
      finalValue = MAX_VALUE;
    }

    if (finalValue > disponibleTickets) {
      finalValue = disponibleTickets;
      setAlertaTickets(`Solo quedan ${disponibleTickets} tickets disponibles`);
    } else {
      setAlertaTickets("");
    }

    formik.setFieldValue("numberTickets", finalValue);
    updateTotal(finalValue);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        setPreview(base64 as string);
        formik.setFieldValue("voucher", base64);
      } catch (error) {
        console.error("Error al procesar la imagen:", error);
      }
    }
  };

  const scrollToBuy = () => {
    buySectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const percentAvailable = Math.max(
    0,
    Math.min(100, (disponibleTickets / TOTAL_TICKETS) * 100),
  );

  const rawPrizes = raffleActually?.prizes ?? [];
  const totalRepartir = rawPrizes.reduce(
    (sum, prize) => sum + parseMoney(prize.amount),
    0,
  );
  const displayPrizes = rawPrizes.map((prize, index) => ({
    icon: index === 0 ? FiAward : FiStar,
    place: prize.title || `Premio ${index + 1}`,
    amount: prize.amount,
    note: index === 0 ? "Primer lugar" : "Premio adicional",
    tag: `#${index + 1}`,
    highlight: index === 0,
  }));
  if (totalRepartir > 0) {
    displayPrizes.push({
      icon: FiGift,
      place: "Total a Repartir",
      amount: `$${totalRepartir.toLocaleString()}`,
      note: "En premios",
      tag: "Total",
      highlight: true,
    });
  }

  return (
    <div>
      {showIGOverlay ? (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 z-50">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl backdrop-blur-md">
            <img
              src="/logo.webp"
              alt="Cargando..."
              className="w-32 h-32 animate-pulse rounded-full mb-6"
            />

            <h2 className="text-xl font-semibold text-gray-300">
              Abriendo en tu navegador…
            </h2>
            <p className="text-gray-400 mt-1">
              Para continuar fuera de Instagram
            </p>

            <p className="mt-3 text-sm text-gray-200">
              {count > 0
                ? `Intentando en ${count}s…`
                : "Si no se abre automáticamente:"}
            </p>

            <button
              onClick={openInExternalBrowser}
              className="mt-6 px-5 py-2 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Abrir en Navegador Externo
            </button>
            <p className="mt-5 text-sm text-gray-200">
              ¿No abre? Toca los <strong className="text-gray-300">···</strong>{" "}
              y selecciona{" "}
              <strong className="text-gray-300">
                {"Abrir en Navegador Externo"}
              </strong>{" "}
              ↘️
            </p>
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-900 z-50">
              <img
                src="/logo.webp"
                alt="Cargando..."
                className="w-24 h-24 rounded-full border-2 border-yellow-400/70 animate-pulse mb-5"
              />
              <p className="font-bebas text-3xl tracking-wide text-white">
                Denilson Bastidas
              </p>
              <p className="text-gray-400 mt-1 mb-5">
                Cargando rifas y datos...
              </p>
              <span className="w-8 h-8 border-2 border-white/20 border-t-yellow-400 rounded-full animate-spin" />
            </div>
          )}
          {!isLoading && (
            <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-b from-[#0b1220] via-[#0d1b30] to-[#090d16]">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-16 w-[420px] h-[420px] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute top-[35%] -right-24 w-[480px] h-[480px] bg-blue-500/10 rounded-full blur-[140px]" />
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px]" />
              </div>

              <div className="relative z-10 w-full bg-black/20 backdrop-blur-sm overflow-hidden">
                <div className="ticker-track flex w-max gap-8 py-2 whitespace-nowrap">
                  {[...PROMO_MESSAGES, ...PROMO_MESSAGES].map((message, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                      <span className="font-medium">{message}</span>
                      <span className="text-gray-600">·</span>
                    </span>
                  ))}
                </div>
              </div>
              <div className="relative z-10 flex-grow">
                <HeaderPage
                  name={raffleActually?.name}
                  description={raffleActually?.description}
                  images={raffleActually?.images}
                  ticketPrice={parseFloat(raffleActually?.ticketPrice)}
                  availabilityPercent={percentAvailable}
                  onBuyClick={scrollToBuy}
                  onVerifyClick={() => setIsConsultModalOpen(true)}
                />

                {displayPrizes.length > 0 && raffleActually?.visible && (
                  <div className="w-full pt-6 pb-10">
                    <div className="max-w-4xl mx-auto px-6 md:px-10">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-yellow-400/15 text-yellow-400 shrink-0">
                          <FiAward size={22} />
                        </span>
                        <div>
                          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                            Premios
                          </h3>
                          <p className="text-sm text-gray-400">
                            Esto es lo que puedes ganar
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayPrizes.map(
                          ({ icon: Icon, place, amount, note, tag, highlight }) => (
                            <div
                              key={place}
                              className={`relative flex flex-col items-center text-center gap-1.5 rounded-2xl p-5 ${
                                highlight
                                  ? "bg-gradient-to-b from-yellow-400/15 to-amber-500/5 border border-yellow-400/40"
                                  : "bg-gray-900/60 border border-gray-700"
                              }`}
                            >
                              <span
                                className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                  highlight
                                    ? "bg-yellow-400 text-gray-900"
                                    : "bg-gray-700 text-gray-200"
                                }`}
                              >
                                {tag}
                              </span>
                              <span
                                className={`flex items-center justify-center w-14 h-14 rounded-2xl mb-1 ${
                                  highlight
                                    ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-gray-900"
                                    : "bg-blue-500/15 text-blue-300"
                                }`}
                              >
                                <Icon size={26} />
                              </span>
                              <p
                                className={`text-[11px] font-semibold uppercase tracking-wider ${
                                  highlight ? "text-yellow-400" : "text-gray-400"
                                }`}
                              >
                                {place}
                              </p>
                              <p className="text-3xl font-extrabold text-white leading-tight">
                                {amount}
                              </p>
                              <p className="text-sm text-gray-400">{note}</p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {disponibleTickets > 0 &&
                disponibleWithNoAproved > 0 &&
                raffleActually?.visible ? (
                  <div
                    ref={buySectionRef}
                    className="w-full pt-6 pb-20"
                  >
                    <div className="max-w-4xl mx-auto px-6 md:px-10">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-green-500/15 text-green-400 shrink-0">
                            <FiShoppingBag size={22} />
                          </span>
                          <div>
                            <h3 className="text-xl md:text-2xl font-bold text-white leading-tight">
                              Comprar tus tickets
                            </h3>
                            <p className="text-sm text-gray-400">
                              Mínimo {raffleActually?.minValue} y máximo {MAX_VALUE} tickets por compra
                            </p>
                          </div>
                        </div>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            formik.handleSubmit(e);
                          }}
                          className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6 items-start"
                        >
                          <div className="space-y-5">
                            <div className="bg-black/25 border border-gray-700 rounded-2xl p-5">
                              <div className="flex items-center justify-between mb-4">
                                <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-200">
                                  <FiHash size={14} className="text-gray-400" />
                                  Cantidad de tickets
                                </p>
                                <span className="text-xs text-gray-500">
                                  Mín. {raffleActually?.minValue} · Máx. {MAX_VALUE}
                                </span>
                              </div>

                              <div className="flex items-center justify-center gap-3 bg-gray-900/60 border border-gray-700 rounded-2xl py-3">
                                <button
                                  type="button"
                                  disabled={
                                    parseInt(formik.values.numberTickets) <=
                                    (raffleActually?.minValue ?? 1)
                                  }
                                  onClick={() =>
                                    handleTicketChange(
                                      parseInt(formik.values.numberTickets) - 1,
                                    )
                                  }
                                  aria-label="Restar ticket"
                                  className={`w-10 h-10 ${
                                    parseInt(formik.values.numberTickets) <= (raffleActually?.minValue ?? 1)
                                      ? "bg-gray-700 text-gray-500"
                                      : "bg-gray-700 hover:bg-gray-600 text-white"
                                  } rounded-full flex items-center justify-center transition duration-200 disabled:cursor-not-allowed`}
                                >
                                  <FiMinus size={18} />
                                </button>

                                <input
                                  ref={inputRef}
                                  type="number"
                                  name="numberTickets"
                                  value={formik.values.numberTickets}
                                  onChange={handleInputChange}
                                  onBlur={(e) => {
                                    formik.handleBlur(e);
                                    const value = parseInt(e.target.value);

                                    if (!isNaN(value)) {
                                      handleTicketChange(value);
                                    }
                                  }}
                                  className="w-20 text-center bg-transparent text-white text-2xl font-extrabold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  min={raffleActually?.minValue}
                                  max={MAX_VALUE}
                                />

                                <button
                                  type="button"
                                  disabled={parseInt(formik.values.numberTickets) >= MAX_VALUE}
                                  onClick={() =>
                                    handleTicketChange(
                                      parseInt(formik.values.numberTickets) + 1,
                                    )
                                  }
                                  aria-label="Sumar ticket"
                                  className={`w-10 h-10 ${
                                    parseInt(formik.values.numberTickets) >= MAX_VALUE
                                      ? "bg-blue-600/40 text-gray-400"
                                      : "bg-blue-600 hover:bg-blue-700 text-white"
                                  } rounded-full flex items-center justify-center transition duration-200 disabled:cursor-not-allowed`}
                                >
                                  <FiPlus size={18} />
                                </button>
                              </div>

                              {formik.touched.numberTickets && formik.errors.numberTickets ? (
                                <div className="text-red-500 text-xs text-center mt-2">{formik.errors.numberTickets}</div>
                              ) : null}

                              {alertaTickets && (
                                <p className="bg-danger/10 border border-danger/30 text-red-300 px-3 py-2 rounded-xl text-xs mt-3 flex items-center justify-center gap-2">
                                  <FiAlertTriangle size={14} />
                                  {alertaTickets}
                                </p>
                              )}

                              <p className="text-xs text-gray-500 mt-4 mb-2">Selección rápida</p>
                              <div className="flex flex-wrap gap-2">
                                {predefinedValues.map((value) => {
                                  const isActive =
                                    parseInt(formik.values.numberTickets) === value;
                                  return (
                                    <button
                                      key={value}
                                      type="button"
                                      className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition ${
                                        isActive
                                          ? "bg-blue-600 border-blue-500 text-white"
                                          : "bg-gray-900/60 border-gray-700 text-gray-300 hover:border-blue-500 hover:text-white"
                                      }`}
                                      onClick={() => handlePredefinedSelection(value)}
                                    >
                                      {value}
                                    </button>
                                  );
                                })}
                              </div>

                              <div className="mt-4 flex items-center justify-between rounded-xl bg-blue-500/10 border border-blue-500/20 px-4 py-3">
                                <span className="text-sm text-gray-300">Total a pagar</span>
                                <span className="text-lg font-extrabold text-blue-300">
                                  {selectedBank === "BDV" || !selectedBank
                                    ? `${totalBS.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} Bs`
                                    : `${totalUSD} $`}
                                </span>
                              </div>
                            </div>

                            <div className="rounded-2xl border border-gray-700 bg-black/20 p-4">
                              <PaymentMethods
                                onSelectedBank={(type: string) => setSelectedBank(type)}
                                totalBs={totalBS}
                                totalUSD={totalUSD}
                              />
                            </div>
                          </div>

                          <div className="bg-black/25 border border-gray-700 rounded-2xl p-5 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-200 mb-1.5">
                                  <FiUser size={14} className="text-gray-400" />
                                  Nombre y Apellido
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="fullName"
                                  placeholder="Pedro José"
                                  value={formik.values.fullName}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="w-full p-3 border border-gray-600 rounded-xl bg-gray-900 text-white outline-none focus:border-blue-400 transition"
                                />
                                {formik.touched.fullName && formik.errors.fullName ? (
                                  <div className="text-red-500 text-xs mt-1">{formik.errors.fullName}</div>
                                ) : null}
                              </div>

                              <div>
                                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-200 mb-1.5">
                                  <FiMail size={14} className="text-gray-400" />
                                  Correo electrónico
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  placeholder="pedroj@gmail.com"
                                  value={formik.values.email}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  className="w-full p-3 border border-gray-600 rounded-xl bg-gray-900 text-white outline-none focus:border-blue-400 transition"
                                />
                                {formik.touched.email && formik.errors.email ? (
                                  <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
                                ) : null}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-200 mb-1.5">
                                  Teléfono
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="flex">
                                  <PhonePrefixSelect
                                    value={phonePrefix}
                                    onChange={setPhonePrefix}
                                  />
                                  <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                      setPhoneNumber(e.target.value.replace(/[^\d]/g, ""))
                                    }
                                    onBlur={formik.handleBlur}
                                    name="phone"
                                    placeholder="4121234567"
                                    className="w-full p-3 border border-gray-600 rounded-r-xl bg-gray-900 text-white outline-none focus:border-blue-400 transition"
                                  />
                                </div>
                                {formik.touched.phone && formik.errors.phone ? (
                                  <div className="text-red-500 text-xs mt-1">{formik.errors.phone}</div>
                                ) : null}
                              </div>

                              <div>
                                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-200 mb-1.5">
                                  <FiHash size={14} className="text-gray-400" />
                                  N° de Comprobante
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="reference"
                                  value={formik.values.reference}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  placeholder="234533 o Zelle Mario castro"
                                  className="w-full p-3 border border-gray-600 rounded-xl bg-gray-900 text-white outline-none focus:border-blue-400 transition"
                                />
                                {formik.touched.reference && formik.errors.reference ? (
                                  <div className="text-red-500 text-xs mt-1">{formik.errors.reference}</div>
                                ) : null}
                              </div>
                            </div>

                            <div className="w-full">
                              <p className="flex items-center gap-1.5 text-sm font-semibold text-gray-200 mb-1.5">
                                Comprobante de pago
                                <span className="text-red-500">*</span>
                              </p>
                              <p className="text-gray-500 text-xs mb-2">Foto o captura de pantalla</p>

                              <label
                                htmlFor="voucher-upload"
                                className="flex items-center justify-center w-full h-24 p-4 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:bg-white/5 transition overflow-hidden"
                              >
                                {preview ? (
                                  <img
                                    src={preview}
                                    alt="Vista previa"
                                    className="w-full h-full object-contain rounded-lg"
                                  />
                                ) : (
                                  <div className="flex flex-col items-center gap-2">
                                    <FiUploadCloud className="text-3xl text-gray-400" />
                                    <p className="text-gray-400 text-sm underline">Haz clic para subir una imagen</p>
                                  </div>
                                )}
                              </label>

                              <input
                                id="voucher-upload"
                                type="file"
                                name="voucher"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                              />

                              {formik.touched.voucher && formik.errors.voucher && (
                                <div className="text-red-500 text-xs mt-1">{formik.errors.voucher}</div>
                              )}
                            </div>

                            {isSubmitting ? (
                              <Skeleton
                                height={48}
                                className="rounded-xl animate-pulse"
                              />
                            ) : (
                              <button
                                type="submit"
                                className="w-full font-bold text-gray-900 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:shadow-yellow-500/50 shadow-md shadow-yellow-500/30 py-3.5 rounded-xl transition-shadow"
                              >
                                Comprar Tickets
                              </button>
                            )}

                            <p className="text-xs text-gray-500 text-center">
                              Debes esperar entre 24 y 36 horas mientras validamos tu compra.
                              Luego recibirás tus tickets en tu correo electrónico.
                            </p>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full pt-6 pb-20">
                    <div className="max-w-lg mx-auto px-6 flex flex-col gap-4 text-center items-center">
                      <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/15 text-red-400">
                        <FiXCircle size={30} />
                      </span>
                      <p className="text-2xl md:text-3xl font-bold text-red-400">
                        Números Agotados
                      </p>
                      <p className="text-gray-300">
                        Ya está todo listo. Para más información, mantente pendiente de
                        las historias en Instagram.
                      </p>
                      <img
                        src="/logo.webp"
                        alt="logo denilson bastidas"
                        className="w-24 h-24 rounded-full border-2 border-yellow-400/70"
                        loading="lazy"
                      />
                      <a
                        href="https://www.instagram.com/denilsonbastidas"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-300 underline font-semibold hover:text-blue-200 transition duration-300"
                      >
                        Denilson Bastidas
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative z-10">
                <Footer />
              </div>
            </section>
          )}
        </>
      )}

      {!showIGOverlay && !isLoading && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 pl-3 pr-4 py-3 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold shadow-xl shadow-green-500/30 hover:scale-105 transition"
        >
          <FaWhatsapp size={22} />
          <span className="text-sm">Soporte</span>
        </a>
      )}

      <ConsultModal
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        whatsappUrl={whatsappUrl}
        phoneSupport={PHONE_SUPPORT}
      />
    </div>
  );
}

export default HomePage;
