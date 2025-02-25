import {
  getTickets,
  raffleVisibility,
  tikketApprove,
  tikketDenied,
} from "@/services";
import { fetchAuth } from "@/utils/auth";
import { TicketType } from "@/utils/types";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Panel() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending">("pending");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [soldNumber, setSoldNumber] = useState<number>(0);

  useEffect(() => {
    fetchAuth(navigate);
  }, [navigate]);

  useEffect(() => {
    const fetchGetTikkets = async () => {
      const responseTikkets: TicketType[] = await getTickets();
      setTickets(responseTikkets);
    };

    fetchGetTikkets();
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
    try {
      setLoadingId(id);
      await tikketApprove(id);
      Swal.fire({
        title: "tikket aprobado!",
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
  };

  const submitTikketDenied = async (id: string) => {
    try {
      setLoadingId(id);
      await tikketDenied(id);
      Swal.fire({
        title: "tikket rechazado!",
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
  };

  useEffect(() => {
    const allSoldNumbers = tickets
      .filter((ticket) => ticket.approved)
      .flatMap((ticket) => ticket.approvalCodes);
    setSoldNumber(allSoldNumbers.length);
  }, [tickets]);

  const clickedRaffleVisibility = async () => {
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
  };

  return (
    <div className="p-6">
      <h2 className="text-4xl uppercase font-bold mb-4">Listado de Tickets</h2>

      <div className="flex w-full justify-between items-center gap-6 mb-4">
        <div className="w-1/4">
          <input
            type="text"
            placeholder="Buscar por número de boleto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border text-black px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center gap-7">
          <button
            onClick={() => clickedRaffleVisibility()}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded"
          >
            Ocultar Rifa
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "pending")}
            className="border px-3 py-2 rounded text-black"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
          </select>

          <p className="text-base font-semibold text-white">
            Total Números Vendidos:{" "}
            <span className="text-green-600">
              {soldNumber?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} 🎯
            </span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 text-black px-4 py-2">
                Nombre
              </th>
              <th className="border border-gray-300 px-4 text-black py-2">
                Correo
              </th>
              <th className="border border-gray-300 px-4 text-black py-2">
                Teléfono
              </th>
              <th className="border border-gray-300 px-4 text-black py-2">
                Tickets
              </th>
              <th className="border border-gray-300 px-4 text-black py-2">
                Referencia
              </th>
              <th className="border border-gray-300 px-4 text-black py-2">
                Metodo
              </th>
              <th className="border border-gray-300 px-4 text-black py-2">
                Monto
              </th>
              <th className="border border-gray-300 px-4 text-black py-2">
                Voucher
              </th>
              <th className="border border-gray-300 px-4 text-black py-2">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket, index) => (
              <tr key={index} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.fullName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.numberTickets}
                </td>
                <td className="border underline border-gray-300 px-4 py-2">
                  {ticket.reference}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.paymentMethod}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {ticket.amountPaid
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  {ticket.paymentMethod === "BDV" ? "Bs" : "$"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <a
                    href={`${ticket.voucher}`}
                    className="text-blue-500 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver imagen
                  </a>
                </td>
                <td className="border border-gray-300 px-4 py-2 flex gap-2 justify-evenly">
                  {ticket.approved ? (
                    <span className="text-green-600 font-semibold">
                      ✔ Aprobado
                    </span>
                  ) : (
                    <div className="flex justify-center gap-6">
                      {loadingId === ticket._id ? (
                        <Skeleton
                          className="animate-pulse"
                          width={100}
                          height={30}
                        />
                      ) : (
                        <button
                          onClick={() => submitTikketApprove(ticket._id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-1 rounded"
                        >
                          Aprobar
                        </button>
                      )}

                      {loadingId === ticket._id ? (
                        <Skeleton
                          className="animate-pulse"
                          width={100}
                          height={30}
                        />
                      ) : (
                        <button
                          onClick={() => submitTikketDenied(ticket._id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-1 rounded"
                        >
                          Rechazar
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Panel;
