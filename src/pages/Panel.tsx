import { CreateRaffleModal } from "@/components/createRaffleModal";
import ImageModal from "@/components/imgModal";
import {
  checkTicket,
  getSoldNumbers,
  getTickets,
  raffleVisibility,
  resendEmail,
  tikketApprove,
  tikketDenied,
} from "@/services";
import { fetchAuth } from "@/utils/auth";
import { TicketType } from "@/utils/types";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { MdOutlineForwardToInbox } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import EditEmailModal from "@/components/editEmailModal";

function Panel() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending">("pending");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [soldNumber, setSoldNumber] = useState<number>(0);
  const [modalCreateRaffle, setModalCreateRaffle] = useState(false);
  const [modalEditEmail, setModalEditEmail] = useState(false);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const [isChangingTypes, setIsChangingTypes] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [resendEmailLoading, setResendEmailLoading] = useState<boolean>(false);
  const [currentTikketSelected, setCurrentTikketSelected] = useState<{
    email: string;
    id: string;
    phone: string;
  }>({ email: "", id: "", phone: "" });
  const [showSold, setShowSold] = useState<boolean>(true);
  const [pageTickets, setPageTickets] = useState<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const numberToShow = 150;
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(
    undefined,
  );

  const handleOpenModal = (image: string) => {
    setSelectedImage(image);
    setImgModalOpen(true);
  };

  useEffect(() => {
    fetchAuth(navigate);
  }, [navigate]);

  useEffect(() => {
    const fetchGetTikkets = async () => {
      setIsLoadingPagination(true)
      const responseTikkets: TicketType[] = await getTickets(
        filter,
        paymentMethod,
        pageTickets
      );

      if (responseTikkets) {
        setTickets((prev) => [...prev, ...responseTikkets]);
        setIsLastPage(responseTikkets.length < numberToShow);
      }

      setIsLoadingPagination(false)
      setIsChangingTypes(false)
    };

    fetchGetTikkets();
  }, [filter, paymentMethod, pageTickets]);

  useEffect(() => {
    setIsChangingTypes(true)
    setTickets([]);
    setPageTickets(1);
    setIsLastPage(false);
  }, [filter, paymentMethod]);

  useEffect(() => {
    const fethSoldNumbers = async () => {
      const responseSoldNumbers = await getSoldNumbers();
      setSoldNumber(responseSoldNumbers?.totalSold);
    };
    fethSoldNumbers();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = search
      ? ticket.approvalCodes.some((code) =>
        code.toLowerCase().includes(search.toLowerCase()),
      )
      : true;

    const matchesFilter = filter === "pending" ? !ticket.approved : true;

    return matchesSearch && matchesFilter;
  });

  const submitTikketApprove = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Aprobar este ticket?",
      text: "Una vez aprobado, no se podrá deshacer esta acción.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        setLoadingId(id);
        await tikketApprove(id);
        Swal.fire({
          title: "¡Ticket aprobado!",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === id
              ? ({ ...ticket, approved: true } as unknown as TicketType)
              : ticket,
          ),
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const submitTikketDenied = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción rechazará el ticket y no se podrá recuperar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        setLoadingId(id);
        await tikketDenied(id);
        Swal.fire({
          title: "¡Ticket rechazado!",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket._id !== id),
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const submitResendEmail = async (id: string) => {
    const result = await Swal.fire({
      title: "¿Desea renviar Tickets a este registro?",
      text: "Una vez aprobado, se renviaran nuevamente los boletos.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Renviar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
    });

    if (result.isConfirmed) {
      try {
        setResendEmailLoading(true);
        await resendEmail(id);
        Swal.fire({
          title: "¡Ticket! reviando",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
      } catch (error) {
        console.log(error);
      } finally {
        setResendEmailLoading(false);
      }
    }
  };

  const clickedRaffleVisibility = async () => {
    const result = await Swal.fire({
      title: "¿Desea ocultar/mostrar la rifa actual?",
      text: "Una vez aceptado, verifica la accion en la pagina principal.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Aceptar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
    });
    if (result.isConfirmed) {
      try {
        await raffleVisibility();
        Swal.fire({
          title: "Success",
          text: "Acabas de ocultar/mostrar la Rifa verifica en el Home Page",
          icon: "success",
          confirmButtonText: "Okey",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleEmailUpdated = (
    id: string,
    newEmail: string,
    newPhone: string,
  ) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === id
          ? { ...ticket, email: newEmail, phone: newPhone }
          : ticket,
      ),
    );
  };

  const handleSearchTicket = async () => {
    if (!search.trim()) return;

    try {
      const result = await checkTicket(search.trim());

      if (result) {
        Swal.fire({
          title: `¡Ticket ${search.trim()} vendido!`,
          html: `
  <div style="
    background-color: #f9fafb;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
    font-family: 'Segoe UI', sans-serif;
    color: #1f2937;
    text-align: left;
  ">
    <h2 style="
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #111827;
    ">🎉 Información del Ganador</h2>

    <div style="margin-bottom: 10px;">
      <span style="font-weight: 500; color: #6b7280;">Nombre:</span><br />
      <span style="font-size: 16px;">${result.fullName}</span>
    </div>

    <div style="margin-bottom: 10px;">
      <span style="font-weight: 500; color: #6b7280;">Email:</span><br />
      <span style="font-size: 16px;">${result.email}</span>
    </div>

    <div style="margin-bottom: 10px;">
      <span style="font-weight: 500; color: #6b7280;">Teléfono:</span><br />
      <span style="font-size: 16px;">${result.phone}</span>
    </div>

    <div style="margin-bottom: 10px;">
      <span style="font-weight: 500; color: #6b7280;">Fecha de compra:</span><br />
      <span style="font-size: 16px;">
        ${new Date(result.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })} a las ${new Date(result.createdAt).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
      </span>
    </div>
  </div>
`,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "No vendido",
          text: "Este ticket aún no ha sido vendido.",
          icon: "warning",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl md:text-4xl uppercase font-bold mb-5 text-center md:text-left" style={{ marginBottom: "50px !important" }}>
        Listado de Tickets
      </h2>

      <div className="flex flex-col md:flex-row w-full justify-between items-center gap-4 md:gap-6 mb-4" style={{ marginTop: "30px" }}>
        <div className="w-full md:w-1/3">
          {filter === "all" ? (
            <div className="flex items-center gap-3 w-full">
              <input
                type="text"
                placeholder="Buscar por número de boleto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border text-black px-3 py-2 rounded"
              />

              <div className="w-full flex flex-col" style={{ marginTop: "-25px" }}>
                <label
                  htmlFor="paymentMethod"
                  className="mr-2 text-sm font-semibold mb-2"
                >
                  Filtrar por método de pago
                </label>
                <select
                  id="paymentMethod"
                  className="border text-black border-gray-300 rounded px-2 py-1"
                  value={paymentMethod || ""}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value === "" ? undefined : e.target.value,
                    )
                  }
                >
                  <option value="">Todos</option>
                  <option value="BDV">BDV</option>
                  <option value="zelle">Zelle</option>
                  <option value="binance">Binance</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar boleto..."
                className="w-full border text-black px-3 py-2 rounded"
              />
              <button
                onClick={handleSearchTicket}
                className="bg-gray-900 text-white font-semibold px-4 py-2 rounded w-full max-w-[120px]"
              >
                buscar
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-wrap md:flex-row items-center gap-4 md:gap-7 w-full md:w-auto">
          <button
            onClick={() => setModalCreateRaffle(true)}
            className="bg-green-500 text-white font-semibold px-4 py-2 rounded w-full md:w-auto"
          >
            Crear nueva rifa
          </button>
          <button
            onClick={() => clickedRaffleVisibility()}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded w-full md:w-auto"
          >
            Cerrar plataforma
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "pending")}
            className="border px-3 py-2 rounded text-black w-full md:w-auto"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
          </select>
          <p className="text-sm md:text-base font-semibold text-white text-center md:text-left">
            Tickets Vendidos:{" "}
            <span
              role="button"
              tabIndex={0}
              onClick={() => setShowSold(!showSold)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setShowSold(!showSold);
                }
              }}
              className="cursor-pointer text-green-600 inline-block"
            >
              {showSold
                ? soldNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                : "*****"}{" "}
              🎯
            </span>
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-sm md:text-base">
          <thead className="text-gray-900 bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Nombre
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Correo
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Teléfono
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Tickets
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Referencia
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Método
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Monto
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Voucher
              </th>
              <th className="border border-gray-300 px-2 md:px-4 py-2">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {
              isChangingTypes ? (
                <div className="d-flex flex-column justify-content-center align-items-center my-4 p-5 text-center">
                  <p className="text-muted">Cargando tickets...</p>
                </div>
              ) : (
                filteredTickets.map((ticket, index) => (
                  <tr key={index} className="text-center">
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      <span className="font-bold px-1">{index + 1}.</span>{" "}
                      {ticket.fullName}
                    </td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      <div className="inline-flex items-center gap-8">
                        {ticket.email}
                        <FaEdit
                          onClick={() => {
                            setModalEditEmail(true);
                            setCurrentTikketSelected({
                              email: ticket.email,
                              id: ticket._id,
                              phone: ticket.phone,
                            });
                          }}
                          size={20}
                          className="cursor-pointer"
                          title="Editar Datos del cliente"
                        />
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      {ticket.phone}
                    </td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      {ticket.numberTickets}
                    </td>
                    <td className="border underline border-gray-300 px-2 md:px-4 py-2">
                      {ticket.reference}
                    </td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      {ticket.paymentMethod}
                    </td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      {ticket?.amountPaid
                        ?.toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      {ticket.paymentMethod === "BDV" ? "Bs" : "$"}
                    </td>
                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      <button
                        className="text-blue-500 underline"
                        rel="noopener noreferrer"
                        onClick={() => handleOpenModal(ticket.voucher)}
                      >
                        Ver imagen
                      </button>
                    </td>

                    <td className="border border-gray-300 px-2 md:px-4 py-2">
                      {ticket.approved ? (
                        <div className="flex items-center py-2 justify-center gap-4">
                          <button
                            onClick={() => submitTikketDenied(ticket._id)}
                            title="Eliminar registro de ticket"
                            className="text-red-600 cursor-pointer text-2xl font-semibold bg-transparent border-none p-0"
                          >
                            X
                          </button>
                          {resendEmailLoading ? (
                            <Skeleton
                              width={20}
                              className="animate-pulse w-full rounded-full"
                              height={20}
                            />
                          ) : (
                            <MdOutlineForwardToInbox
                              onClick={() => submitResendEmail(ticket._id)}
                              size={24}
                              className="text-blue-500 cursor-pointer hover:text-blue-700"
                              title="Reenviar email"
                            />
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col py-2 md:flex-row justify-center items-center gap-2 w-full">
                          {loadingId === ticket._id ? (
                            <Skeleton
                              width={100}
                              className="animate-pulse w-full max-w-[120px]"
                              height={30}
                            />
                          ) : (
                            <button
                              onClick={() => submitTikketApprove(ticket._id)}
                              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-1 rounded w-full max-w-[120px]"
                            >
                              Aprobar
                            </button>
                          )}

                          {loadingId === ticket._id ? (
                            <Skeleton
                              width={100}
                              className="animate-pulse w-full max-w-[120px]"
                              height={30}
                            />
                          ) : (
                            <button
                              onClick={() => submitTikketDenied(ticket._id)}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded w-full max-w-[120px]"
                            >
                              Rechazar
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )
            }
          </tbody>
        </table>

        {
          isLoadingPagination && !isChangingTypes && (
            <div className="d-flex flex-column justify-content-center align-items-center my-4 p-5 text-center">
              <p className="text-muted">Cargando mas...</p>
            </div>
          )
        }

        <div className="flex justify-center items-center gap-4 mt-4 p-5">
          <span className="font-semibold text-gray-300">Página {pageTickets}</span>

          <button
            onClick={() => {
              if (!isLastPage) setPageTickets((prev) => prev + 1);
            }}
            disabled={isLastPage}
            className="px-4 py-2 text-black rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>

      {modalCreateRaffle && (
        <CreateRaffleModal
          isOpen={modalCreateRaffle}
          onClose={() => setModalCreateRaffle(false)}
        ></CreateRaffleModal>
      )}

      {modalEditEmail && (
        <EditEmailModal
          currentTikketSelected={currentTikketSelected}
          isOpen={modalEditEmail}
          onClose={() => setModalEditEmail(false)}
          onEmailUpdated={handleEmailUpdated}
        />
      )}

      {imgModalOpen && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setImgModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Panel;
