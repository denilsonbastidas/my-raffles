import Footer from "@/components/Footer";
import HeaderPage from "@/components/Header";
import PaymentMethods from "@/components/PaymentMethods";
import { getRaffle, submitTicket } from "@/services";
import { EXCHANGE_RATE } from "@/utils/contants";
import { RaffleType } from "@/utils/types";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

function HomePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MIN_VALUE = 2;
  const MAX_VALUE = 100;
  const predefinedValues = [2, 5, 10, 20, 50, 100];

  const [raffleActually, setRaffleActually] = useState<RaffleType>({
    description: "",
    images: [""],
    ticketPrice: 0,
  });

  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBS, setTotalBS] = useState(0);

  useEffect(() => {
    const fetchGetRaffle = async () => {
      const responseRaffle: RaffleType[] = await getRaffle();
      setRaffleActually(responseRaffle[0]);
    };
    fetchGetRaffle();
  }, []);

  const updateTotal = (quantity: number) => {
    const totalUSD = quantity * raffleActually.ticketPrice;
    const totalBS = totalUSD * EXCHANGE_RATE;
    setTotalUSD(totalUSD);
    setTotalBS(totalBS);
  };

  const formik = useFormik({
    initialValues: {
      numberTickets: "",
      fullName: "",
      email: "",
      phone: "",
      reference: "",
      voucher: "",
    },
    validationSchema: Yup.object({
      numberTickets: Yup.number()
        .min(MIN_VALUE, `Debe seleccionar al menos ${MIN_VALUE} números`)
        .max(MAX_VALUE, `No puede seleccionar más de ${MAX_VALUE} números`)
        .required("Este campo es obligatorio"),
      fullName: Yup.string().required("Este campo es obligatorio"),
      email: Yup.string()
        .email("Debe ser un correo válido")
        .required("Este campo es obligatorio"),
      phone: Yup.string().required("Este campo es obligatorio"),
      reference: Yup.string().required("Este campo es obligatorio"),
      voucher: Yup.mixed().required("Debe subir un comprobante de pago"),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        await submitTicket(values);
        Swal.fire({
          title: "¡Gracias por realizar tu compra!",
          text: "Una vez confirmado tu pago te enviaremos los tickets y/o Números de tu compra",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        resetForm();
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error al enviar el formulario:", error);

        Swal.fire({
          title: "Error",
          text: "Hubo un problema con tu compra. Inténtalo nuevamente.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = parseInt(e.target.value, 10);

    if (isNaN(value)) {
      formik.setFieldValue("numberTickets", "");
      setTotalUSD(0);
      setTotalBS(0);
      return;
    }

    if (value < MIN_VALUE) value = MIN_VALUE;
    if (value > MAX_VALUE) value = MAX_VALUE;

    formik.setFieldValue("numberTickets", value);
    updateTotal(value);
  };

  const handlePredefinedSelection = (value: number) => {
    formik.setFieldValue("numberTickets", value);
    updateTotal(value);
  };

  return (
    <section className="mt-6">
      <HeaderPage
        description={raffleActually.description}
        images={raffleActually.images}
        ticketPrice={raffleActually.ticketPrice}
      />

      <div className="flex flex-col text-center items-center mt-6">
        <h3 className="text-3xl font-semibold">
          COMPRA TUS NUMEROS DE LA RIFA
        </h3>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col items-center"
        >
          <label className="text-gray-300">
            Mínimo {MIN_VALUE} y Máximo {MAX_VALUE} Números por Compra
          </label>

          <input
            type="number"
            name="numberTickets"
            value={formik.values.numberTickets}
            onChange={handleInputChange}
            onBlur={formik.handleBlur}
            className="mt-2 p-2 border rounded text-black text-center"
            min={MIN_VALUE}
            max={MAX_VALUE}
          />

          {formik.touched.numberTickets && formik.errors.numberTickets ? (
            <div className="text-red-500">{formik.errors.numberTickets}</div>
          ) : null}

          <p className="mt-2 text-gray-300">
            Selecciona una cantidad de números
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
            <PaymentMethods totalBs={totalBS} totalUSD={totalUSD} />
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <div>
              <p className="text-start font-semibold">
                <span className="text-red-500 ">*</span> Nombre y Apellido:
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
                <span className="text-red-500 ">*</span> Email:
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
                {" "}
                <span className="text-red-500 ">*</span> N° de Comprobante:
              </p>
              <input
                type="text"
                name="reference"
                value={formik.values.reference}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="2345 o Zelle Mario castro"
                className="mt-1 p-2 w-full border rounded text-black"
              />
              {formik.touched.reference && formik.errors.reference ? (
                <div className="text-red-500 text-start">
                  {formik.errors.reference}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 w-full">
            <p className="font-bold flex items-center gap-2">
              <span className="text-red-500 ">*</span> COMPROBANTE DE PAGO:
            </p>
            <p className="text-gray-300 text-sm mb-2">
              Foto o Captura de Pantalla
            </p>
            <input
              type="file"
              name="voucher"
              ref={fileInputRef}
              onChange={(event) =>
                formik.setFieldValue("voucher", event.target.files?.[0])
              }
              className="p-2 w-full border rounded bg-white text-black"
            />
            {formik.touched.voucher && formik.errors.voucher ? (
              <div className="text-red-500 text-start">
                {formik.errors.voucher}
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="mt-6 w-full font-bold bg-green-600  p-2 rounded"
          >
            Comprar Tickets
          </button>
        </form>
        <p className="text-md  text-gray-300 my-8 w-full text-center md:w-1/2">
          Recuerde que debe esperar un lapso de 24 a 36 horas aproximadamente
          mientras nuestro equipo verifica y valida su compra. Los números serán
          enviados a su correo electrónico.
        </p>
      </div>

      <div>
        <Footer />
      </div>
    </section>
  );
}

export default HomePage;
