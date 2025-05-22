import Footer from "@/components/Footer";
import HeaderPage from "@/components/Header";
import PaymentMethods from "@/components/PaymentMethods";
import {
  checkApprovedTickets,
  getParallelDollar,
  getRaffle,
  submitTicket,
} from "@/services";
import { RaffleType } from "@/utils/types";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { FiUploadCloud } from "react-icons/fi";
import { PHONE_SUPPORT } from "@/utils/contants";

function HomePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_VALUE = 100;
  const predefinedValues = [2, 5, 10, 20, 50, 100];
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);

  const [raffleActually, setRaffleActually] = useState<RaffleType>({
    name: "",
    description: "",
    images: [""],
    ticketPrice: "",
    visible: false,
    minValue: 0,
  });

  const [exchangeRateVzla, setExchangeRateVzla] = useState<number>(0);

  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBS, setTotalBS] = useState(0);
  const [selectedBank, setSelectedBank] = useState<string>();

  useEffect(() => {
    formik.setFieldValue("paymentMethod", selectedBank);
    if (selectedBank === "binance" || selectedBank === "zelle") {
      formik.setFieldValue("amountPaid", totalUSD);
      return;
    }
    formik.setFieldValue("amountPaid", totalBS);
  }, [selectedBank]);

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
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGetRaffle();
  }, []);

  const updateTotal = (quantity: number) => {
    const totalUSD = quantity * parseFloat(raffleActually.ticketPrice);
    const totalBS = totalUSD * exchangeRateVzla;
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

        Swal.fire({
          title: "¡Gracias por realizar tu compra!🎉",
          html: `
  <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; width: 100%; padding: 8px;  margin: auto; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center;">

    <p style="color: #555; font-size: 0.95rem;">
      Una vez confirmado tu pago, recibirás tus tickets en tu correo electrónico.
    </p>

    <div style="margin-top: 1.5rem; background: #f5f7fa; padding: 1rem; border-radius: 10px; text-align: left; font-size: 0.95rem; color: #333;">
      <h3 style="color: #222; margin-bottom: 1rem; text-align: center;">📌 Detalles de tu compra:</h3>

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
    <h3 style="font-size: 1rem; color: #444; margin-bottom: 0.5rem;"><strong>🧾 Comprobante de pago:</strong></h3>
    <img src="${values.voucher}" alt="Comprobante de pago" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); margin: auto;" />
    </div>
    <!-- Nota final -->
    <p style="margin-top: 2rem; font-size: 0.90rem; color: #666;">
      ⏳ <strong>Recuerda:</strong> debes esperar entre 24 y 36 horas mientras verificamos tu compra.<br />
      Luego, recibirás tus tickets en tu correo electronico <strong>${values.email}</strong>.
    </p>

    <p style="margin-top: 2rem; font-size: 0.95rem; color: #444;">
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

        Swal.fire({
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

    // Permitir vacío (por si el usuario está borrando)
    if (rawValue === "") {
      formik.setFieldValue("numberTickets", "");
      setTotalUSD(0);
      setTotalBS(0);
      return;
    }

    // Solo continuar si es un número válido
    if (/^\d+$/.test(rawValue)) {
      let value = parseInt(rawValue, 10);

      if (value > MAX_VALUE) value = MAX_VALUE;

      formik.setFieldValue("numberTickets", rawValue);
      updateTotal(value);
    }
  };

  const handlePredefinedSelection = (value: number) => {
    formik.setFieldValue("numberTickets", value);
    inputRef.current?.focus();
    updateTotal(value);
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

  const showVerifiedTickect = async () => {
    const { isConfirmed, value: email } = await Swal.fire({
      title: "VERIFICA TUS TICKETS",
      background: "#1e1e1e",
      color: "#f0f0f0",
      html: `
      <div style="font-family: 'Segoe UI', sans-serif; font-size: 0.95rem; color: #e0e0e0;">
        <div style="
          background-color: #2c2c2c;
          padding: 1rem;
          border-radius: 10px;
          border: 1px solid #444;
          margin-bottom: 1.5rem;
        ">
          <p style="margin: 0 0 0.75rem;">
            <strong style="display: block; margin-bottom: 0.5rem; color: #ffdd57;">
              ⚠ SOPORTE TIENE 24 hrs PARA RESPONDERTE Y APROBAR TU COMPRA
            </strong>
            ¿No recibiste tus tickets por correo?
            <strong style="color: #ffffff;"> ¡VERIFÍCALOS AQUÍ! </strong>
          </p>
          <p style="margin-bottom: 0.75rem;">
            Ingresa el correo electrónico que usaste para la compra en el campo de abajo y haz clic en
            <strong>"Verificar Tickets"</strong> para ver tus números de participación.
          </p>
          <p style="margin: 0;">
            <strong>CONTÁCTANOS POR EL TLF DE SOPORTE:</strong><br/>
            ${PHONE_SUPPORT}
          </p>
        </div>

        <div style="margin-top: 1rem;">
          <label for="email" style="display: block; margin-bottom: 0.4rem; font-weight: 600;">
            Email para Verificar Tickets
          </label>
          <input
            id="email"
            type="email"
            placeholder="Ingresa tu email"
            style="
              width: 100%;
              padding: 0.6rem 0.75rem;
              border: 1px solid #666;
              border-radius: 6px;
              font-size: 0.95rem;
              background-color: #111;
              color: #fff;
              box-sizing: border-box;
            "
          />
        </div>
      </div>
    `,
      confirmButtonText: "Verificar Tickets",
      cancelButtonText: "Cancelar",
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: async () => {
        const input = document.getElementById("email") as HTMLInputElement;
        const email = input?.value;
        if (!email || !email.includes("@")) {
          Swal.showValidationMessage("Por favor, ingresa un email válido");
          return;
        }

        try {
          const response = await checkApprovedTickets(email);

          if (!response || response.length === 0) {
            Swal.showValidationMessage(
              "No se encontraron tickets aprobados con ese correo",
            );
            return;
          }

          return response;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          Swal.showValidationMessage(
            error?.message || "Error al verificar los tickets",
          );
        }
      },
      width: 600,
      icon: "info",
      iconColor: "#00d1ff",
      confirmButtonColor: "#1D2939",
      cancelButtonColor: "#6c757d",
    });

    // si el usuario confirmó y hay tickets aprobados
    if (isConfirmed && Array.isArray(email)) {
      const tickets = email;

      const ticketsHtml = tickets
        .map(
          (ticket) => `
      <div style="
        background-color: #2c2c2c;
        padding: 1rem 1.2rem;
        border-radius: 8px;
        border: 1px solid #444;
        margin-bottom: 1rem;
        box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #e0e0e0;
      ">
        <p style="margin: 0 0 0.5rem; font-size: 1.05rem;">
          <strong style="color: #00d1ff;">Nombre:</strong> ${ticket.nombre}
        </p>
        <p style="margin: 0 0 0.5rem; font-size: 1.05rem;">
          <strong style="color: #00d1ff;">Email:</strong> ${ticket.email}
        </p>
        <p style="margin: 0; font-size: 1rem;">
          <strong style="color: #00d1ff;">Tickets:</strong>
          <span style="
            background-color: #00d1ff22;
            color: #00d1ff;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
            letter-spacing: 0.5px;
            display: inline-block;
            margin-top: 4px;
            ">
            ${ticket.tickets.join(", ")}
          </span>
        </p>
      </div>
    `,
        )
        .join("");

      Swal.fire({
        title: "Tus Tickets Aprobados",
        background: "#1e1e1e",
        color: "#f0f0f0",
        html: `
    <div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
      ${ticketsHtml}
    </div>
     <p style="
        font-size: 0.8rem; 
        color: #888; 
        margin-top: 1rem; 
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-align: center;
      ">
        📸 Te recomendamos tomar captura o guardar esta información para referencia.
      </p>
  `,
        confirmButtonText: "Cerrar",
        width: 600,
        icon: "success",
        iconColor: "#00d1ff",
        confirmButtonColor: "#1D2939",
      });
    }
  };

  return (
    <div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <img
            src="logo.webp"
            alt="Cargando..."
            className="w-32 h-32 animate-pulse rounded-full"
          />
        </div>
      )}
      {!isLoading && (
        <section className="min-h-screen flex flex-col">
          <div className="flex-grow">
            <HeaderPage
              name={raffleActually?.name}
              description={raffleActually?.description}
              images={raffleActually?.images}
              ticketPrice={parseFloat(raffleActually?.ticketPrice)}
            />

            {raffleActually?.visible ? (
              <div className="flex flex-col text-center items-center mt-6">
                <h3 className="text-3xl font-semibold">COMPRAR TUS TICKETS</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit(e);
                  }}
                  className="flex flex-col items-center"
                >
                  <label className="text-gray-300">
                    Mínimo {raffleActually?.minValue} y Máximo {MAX_VALUE}{" "}
                    Tickets por Compra
                  </label>

                  <input
                    ref={inputRef}
                    type="number"
                    name="numberTickets"
                    value={formik.values.numberTickets}
                    onChange={handleInputChange}
                    onBlur={formik.handleBlur}
                    className="mt-2 p-2 border rounded text-black text-center"
                    min={raffleActually?.minValue}
                    max={MAX_VALUE}
                  />

                  {formik.touched.numberTickets &&
                  formik.errors.numberTickets ? (
                    <div className="text-red-500">
                      {formik.errors.numberTickets}
                    </div>
                  ) : null}

                  <p className="mt-2 text-gray-300">
                    Selecciona una cantidad de Tickets
                  </p>

                  <div className="grid grid-cols-6 gap-2 mb-8 mt-2 w-full max-w-xs">
                    {predefinedValues.map((value) => (
                      <button
                        key={value}
                        type="button"
                        className="bg-blue-400 text-white p-2 rounded text-center w-full"
                        onClick={() => handlePredefinedSelection(value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>

                  <div className="mb-4">
                    <PaymentMethods
                      onSelectedBank={(type: string) => setSelectedBank(type)}
                      totalBs={totalBS}
                      totalUSD={totalUSD}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 w-full">
                    <div>
                      <p className="text-start font-semibold">
                        <span className="text-red-500 ">*</span> Nombre y
                        Apellido:
                      </p>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Pedro jose"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 p-2 w-full border rounded text-black"
                      />
                      {formik.touched.fullName && formik.errors.fullName ? (
                        <div className="text-red-500 text-start">
                          {formik.errors.fullName}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <p className="font-semibold text-start">
                        {" "}
                        <span className="text-red-500 ">*</span> Correo
                        electrónico (se recomienda Gmail):
                      </p>
                      <input
                        type="email"
                        name="email"
                        placeholder="pedroj@gmail.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mt-1 p-2 w-full border rounded text-black"
                      />

                      {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 text-start">
                          {formik.errors.email}
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <p className="font-semibold text-start">
                        {" "}
                        <span className="text-red-500 ">*</span> Teléfono:
                      </p>
                      <input
                        type="tel"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="+584124564323"
                        className="mt-1 p-2 w-full border rounded text-black"
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-red-500 text-start">
                          {formik.errors.phone}
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <p className="font-semibold text-start">
                        <span className="text-red-500 ">*</span> N° de
                        Comprobante
                      </p>
                      <input
                        type="text"
                        name="reference"
                        value={formik.values.reference}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="234533 o Zelle Mario castro"
                        className="mt-1 p-2 w-full border rounded text-black"
                      />
                      {formik.touched.reference && formik.errors.reference ? (
                        <div className="text-red-500 text-start">
                          {formik.errors.reference}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 w-full max-w-md">
                    <p className="font-bold flex items-center gap-2">
                      <span className="text-red-500">*</span>COMPROBANTE DE
                      PAGO:
                    </p>
                    <p className="text-gray-400 text-sm mb-2">
                      Foto o Captura de Pantalla
                    </p>

                    <label
                      htmlFor="voucher-upload"
                      className="flex items-center justify-center w-full h-24 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition overflow-hidden"
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
                          <p className="text-gray-500 underline">
                            Haz clic para subir una imagen
                          </p>
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
                      <div className="text-red-500 text-sm mt-1 text-start">
                        {formik.errors.voucher}
                      </div>
                    )}
                  </div>

                  {isSubmitting ? (
                    <Skeleton
                      height={45}
                      width={350}
                      className="rounded mt-6 animate-pulse"
                    />
                  ) : (
                    <button
                      type="submit"
                      className="mt-6 w-full font-bold bg-green-600 p-2 rounded"
                    >
                      Comprar Tickets
                    </button>
                  )}
                </form>

                <p className="text-md  text-gray-300 my-4 w-full text-center md:w-1/2">
                  Recuerde que debe esperar un lapso de 24 a 36 horas
                  aproximadamente mientras nuestro equipo verifica y valida su
                  compra. Los tickets serán enviados a su correo electrónico.
                </p>
              </div>
            ) : (
              <div className="h-96 flex flex-col gap-4 text-center items-center justify-center">
                <p className="text-lg font-bold text-red-500 md:text-4xl">
                  Números Agotados.
                </p>
                <p className="text-lg font-bold md:text-4xl">
                  Ya esta todo listo, Para mayor información pendiente de las
                  historias en Instagram.
                </p>
                <img
                  src="logo.webp"
                  alt="logo denilson bastidas"
                  className="w-52 h-52 rounded-full"
                  loading="lazy"
                />
                <a
                  href="https://www.instagram.com/denilsonbastidas"
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-500 text-lg underline font-semibold hover:text-red-700 transition duration-300"
                >
                  Denilson Bastidas
                </a>
              </div>
            )}
            <div className="flex justify-center items-center my-6">
              <button
                onClick={showVerifiedTickect}
                className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow-2xl hover:bg-gray-800 hover:shadow-lg transition duration-300 ease-in-out"
              >
                Verifica Tus Tickets
              </button>
            </div>
          </div>
          <div>
            <Footer />
          </div>
        </section>
      )}
    </div>
  );
}

export default HomePage;
