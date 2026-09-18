import { CreateRaffleModal } from "@/components/createRaffleModal";
import { UpdateRaffleModal } from "@/components/updateRaffleModal";
import ImageModal from "@/components/imgModal";
import {
  checkTicket,
  getSoldNumbers,
  getTickets,
  raffleVisibility,
  resendEmail,
  tikketApprove,
  tikketDenied,
  getRaffle,
  deleteRaffle,
} from "@/services";
import { fetchAuth } from "@/utils/auth";
import { TicketType, RaffleType } from "@/utils/types";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import { swal, swalSuccess, swalDanger } from "@/utils/swal";
import {
  FiTag,
  FiGift,
  FiDollarSign,
  FiAward,
  FiPieChart,
  FiLogOut,
  FiMenu,
  FiSearch,
  FiPlus,
  FiEdit3,
  FiEdit2,
  FiEyeOff,
  FiEye,
  FiSend,
  FiTrash2,
  FiChevronRight,
  FiChevronLeft,
  FiCheck,
  FiX,
  FiInfo,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import EditEmailModal from "@/components/editEmailModal";
import EditDollarModal from "@/components/editDollarModal";
import TopBuyersModal from "@/components/topBuyersModal";
import MoneySummaryModal from "@/components/MoneySummaryModal";
import TicketDetailModal from "@/components/TicketDetailModal";
import Button from "@/components/ui/Button";

function Panel() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending">("pending");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [soldNumber, setSoldNumber] = useState<number>(0);
  const [modalCreateRaffle, setModalCreateRaffle] = useState(false);
  const [modalUpdateRaffle, setModalUpdateRaffle] = useState(false);
  const [modalEditEmail, setModalEditEmail] = useState(false);
  const [imgModalOpen, setImgModalOpen] = useState(false);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const [isChangingTypes, setIsChangingTypes] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [resendEmailLoading, setResendEmailLoading] = useState<boolean>(false);
  const [isModalDollarOpen, setIsModalDollarOpen] = useState<boolean>(false);
  const [isModalBuyersOpen, setIsModalBuyersOpen] = useState<boolean>(false);
  const [isModalSummaryOpen, setIsModalSummaryOpen] = useState<boolean>(false);
  const [raffleActually, setRaffleActually] = useState<RaffleType>({
    name: "",
    description: "",
    images: [],
    ticketPrice: "",
    visible: true,
    minValue: 1,
  });
  const [currentTikketSelected, setCurrentTikketSelected] = useState<{
    email: string;
    id: string;
    phone: string;
    numberTickets: number;
    paymentMethod: string;
  }>({ email: "", id: "", phone: "", numberTickets: 0, paymentMethod: "" });
  const [showSold, setShowSold] = useState<boolean>(true);
  const [pageTickets, setPageTickets] = useState<number>(1);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [orderTickets, setOrderTickets] = useState<string>("desc");
  const numberToShow = 150;
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(
    undefined,
  );
  const orderToSend = filter == "pending" ? "asc" : orderTickets;

  const TOTAL_RAFFLE_TICKETS = 10000;
  const [activeSection, setActiveSection] = useState<"tickets" | "rifa">(
    "tickets",
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(
    () => localStorage.getItem("adminSidebarCollapsed") === "true",
  );
  const [theme, setTheme] = useState<"dark" | "light">(
    () => (localStorage.getItem("adminTheme") as "dark" | "light") || "dark",
  );
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [detailTicket, setDetailTicket] = useState<TicketType | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("adminTheme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin");
  };

  const handleOpenModal = (image: string) => {
    setSelectedImage(image);
    setImgModalOpen(true);
  };

  useEffect(() => {
    fetchAuth(navigate);
  }, [navigate]);

  const fetchGetTikkets = async () => {
    setIsLoadingPagination(true);
    const responseTikkets: TicketType[] = await getTickets(
      filter,
      paymentMethod,
      pageTickets,
      orderToSend,
    );

    if (responseTikkets) {
      setTickets((prev) => [...prev, ...responseTikkets]);
      setIsLastPage(responseTikkets.length < numberToShow);
    }

    setIsLoadingPagination(false);
    setIsChangingTypes(false);
  };

  useEffect(() => {
    fetchGetTikkets();
  }, [filter, paymentMethod, pageTickets, orderTickets]);

  useEffect(() => {
    setIsChangingTypes(true);
    setTickets([]);
    setPageTickets(1);
    setIsLastPage(false);
  }, [filter, paymentMethod, orderTickets]);

  useEffect(() => {
    const fethSoldNumbers = async () => {
      const responseSoldNumbers = await getSoldNumbers();
      setSoldNumber(responseSoldNumbers?.totalSold);
      setStatsLoading(false);
    };
    fethSoldNumbers();
  }, []);

  useEffect(() => {
    const fetchPendingCount = async () => {
      const res = await getTickets("pending", undefined, 1, "asc");
      if (Array.isArray(res)) setPendingCount(res.length);
    };
    fetchPendingCount();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = query
      ? ticket.approvalCodes.some((code) =>
          code.toLowerCase().includes(query),
        ) ||
        ticket.fullName?.toLowerCase().includes(query) ||
        ticket.email?.toLowerCase().includes(query)
      : true;

    const matchesFilter = filter === "pending" ? !ticket.approved : true;

    const matchesDateRange = (() => {
      if (!dateFrom && !dateTo) return true;
      if (!ticket.createdAt) return true;
      const created = new Date(ticket.createdAt).getTime();
      if (dateFrom && created < new Date(dateFrom).getTime()) return false;
      if (dateTo) {
        const end = new Date(dateTo);
        end.setHours(23, 59, 59, 999);
        if (created > end.getTime()) return false;
      }
      return true;
    })();

    return matchesSearch && matchesFilter && matchesDateRange;
  });

  useEffect(() => {
    const fetchGetRaffle = async () => {
      try {
        const responseRaffle = await getRaffle();
        setRaffleActually(responseRaffle[0]);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchGetRaffle();
  }, []);

  const submitTikketApprove = async (id: string) => {
    const result = await swalSuccess.fire({
      title: "¿Aprobar este ticket?",
      text: "Una vez aprobado, no se podrá deshacer esta acción.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoadingId(id);
        await tikketApprove(id);
        swalSuccess.fire({
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
        setPendingCount((c) => (c !== null ? Math.max(0, c - 1) : c));
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const submitTikketDenied = async (id: string) => {
    const result = await swalDanger.fire({
      title: "¿Estás seguro?",
      text: "Esta acción rechazará el ticket y no se podrá recuperar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setLoadingId(id);
        await tikketDenied(id);
        swal.fire({
          title: "¡Ticket rechazado!",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        setTickets((prevTickets) =>
          prevTickets.filter((ticket) => ticket._id !== id),
        );
        setPendingCount((c) => (c !== null ? Math.max(0, c - 1) : c));
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingId(null);
      }
    }
  };

  const submitResendEmail = async (id: string) => {
    const result = await swal.fire({
      title: "¿Desea renviar Tickets a este registro?",
      text: "Una vez aprobado, se renviaran nuevamente los boletos.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Renviar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        setResendEmailLoading(true);
        await resendEmail(id);
        swalSuccess.fire({
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
    const isCurrentlyVisible = raffleActually?.visible;
    const result = await swal.fire({
      title: isCurrentlyVisible
        ? "¿Desea ocultar la rifa actual?"
        : "¿Desea mostrar la rifa actual?",
      text: "Una vez aceptado, verifica la accion en la pagina principal.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Aceptar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await raffleVisibility();
        swalSuccess.fire({
          title: "Success",
          text: isCurrentlyVisible
            ? "Acabas de ocultar la Rifa, verifica en el Home Page"
            : "Acabas de mostrar la Rifa, verifica en el Home Page",
          icon: "success",
          confirmButtonText: "Okey",
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const clickedDeleteRaffle = async () => {
    const result = await swalDanger.fire({
      title: "¿Eliminar la rifa actual?",
      html: "Esta acción <strong>borrará la rifa y TODOS los tickets</strong> (aprobados y pendientes) de forma permanente. No se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar todo",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteRaffle();
        swalSuccess.fire({
          title: "Rifa eliminada",
          text: "La rifa y todos sus tickets fueron eliminados.",
          icon: "success",
          confirmButtonText: "Okey",
        });
        window.location.reload();
      } catch (error) {
        console.log(error);
        swal.fire({
          title: "Error",
          text: "No se pudo eliminar la rifa.",
          icon: "error",
        });
      }
    }
  };

  const handleEmailUpdated = () => {
    setTickets([]);
    fetchGetTikkets();
  };

  const handleOpenDetail = (ticket: TicketType) => {
    setDetailTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const handleSearchTicket = async () => {
    const { value: ticketNumber } = await swal.fire({
      title: "Verificar boleto exacto",
      input: "text",
      inputLabel: "Número de boleto",
      inputPlaceholder: "Ej: 01234",
      showCancelButton: true,
      confirmButtonText: "Verificar",
      cancelButtonText: "Cancelar",
    });

    if (!ticketNumber?.trim()) return;

    try {
      const result = await checkTicket(ticketNumber.trim());

      if (result) {
        swal.fire({
          title: `¡Ticket ${ticketNumber.trim()} vendido!`,
          html: `
  <div style="
    background-color: #1f2937;
    padding: 20px;
    border-radius: 12px;
    font-family: 'Segoe UI', sans-serif;
    color: #e5e7eb;
    text-align: left;
  ">
    <h2 style="
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #ffffff;
    ">🎉 Información del Ganador</h2>

    <div style="margin-bottom: 10px;">
      <span style="font-weight: 500; color: #9ca3af;">Nombre:</span><br />
      <span style="font-size: 16px;">${result.fullName}</span>
    </div>

    <div style="margin-bottom: 10px;">
      <span style="font-weight: 500; color: #9ca3af;">Email:</span><br />
      <span style="font-size: 16px;">${result.email}</span>
    </div>

    <div style="margin-bottom: 10px;">
      <span style="font-weight: 500; color: #9ca3af;">Teléfono:</span><br />
      <span style="font-size: 16px;">${result.phone}</span>
    </div>

    <div style="margin-bottom: 10px;">
      <span style="font-weight: 500; color: #9ca3af;">Fecha de compra:</span><br />
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
        swal.fire({
          title: `¡Ticket ${ticketNumber.trim()} no vendido!`,
          text: "Este ticket aún no ha sido vendido.",
          icon: "warning",
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    }
  };

  const soldFormatted = soldNumber
    ?.toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const availableTickets = Math.max(0, TOTAL_RAFFLE_TICKETS - soldNumber);
  const percentSold = Math.min(
    100,
    Math.round((soldNumber / TOTAL_RAFFLE_TICKETS) * 100),
  );
  const pieData = [
    { name: "Vendidos", value: soldNumber || 0 },
    { name: "Disponibles", value: availableTickets },
  ];

  return (
    <div className={theme === "dark" ? "dark" : ""}>
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 ${sidebarCollapsed ? "md:w-20" : "md:w-64"} shrink-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className={`flex items-center gap-3 px-5 py-5 border-b border-gray-200 dark:border-gray-700 ${sidebarCollapsed ? "md:justify-center md:px-2" : ""}`}>
          <img
            src="/logo.webp"
            alt="logo"
            className="w-10 h-10 rounded-full border border-yellow-400/70 shrink-0"
          />
          <div className={sidebarCollapsed ? "md:hidden" : ""}>
            <p className="font-bebas text-lg leading-none tracking-wide">
              Denilson Bastidas
            </p>
            <p className="text-xs text-blue-500 dark:text-blue-300">Panel Admin</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className={`px-3 pt-2 pb-1 text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 ${sidebarCollapsed ? "md:hidden" : ""}`}>
            Gestión
          </p>
          <button
            onClick={() => {
              setActiveSection("tickets");
              setSidebarOpen(false);
            }}
            title="Tickets"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${sidebarCollapsed ? "md:justify-center md:px-0" : ""} ${
              activeSection === "tickets"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <FiTag size={18} /> <span className={sidebarCollapsed ? "md:hidden" : ""}>Tickets</span>
            {!!pendingCount && (
              <span
                className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${sidebarCollapsed ? "md:hidden" : ""} ${
                  activeSection === "tickets"
                    ? "bg-white/20 text-white"
                    : "bg-yellow-400/20 text-yellow-600 dark:text-yellow-400"
                }`}
              >
                {pendingCount}
                {pendingCount >= numberToShow ? "+" : ""}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveSection("rifa");
              setSidebarOpen(false);
            }}
            title="Rifa"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${sidebarCollapsed ? "md:justify-center md:px-0" : ""} ${
              activeSection === "rifa"
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
          >
            <FiGift size={18} /> <span className={sidebarCollapsed ? "md:hidden" : ""}>Rifa</span>
          </button>

          <p className={`px-3 pt-4 pb-1 text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 ${sidebarCollapsed ? "md:hidden" : ""}`}>
            Herramientas
          </p>
          <button
            onClick={() => setIsModalDollarOpen(true)}
            title="Actualizar dólar"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition ${sidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
          >
            <FiDollarSign size={18} /> <span className={sidebarCollapsed ? "md:hidden" : ""}>Actualizar dólar</span>
          </button>
          <button
            onClick={() => setIsModalBuyersOpen(true)}
            title="Ranking"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition ${sidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
          >
            <FiAward size={18} /> <span className={sidebarCollapsed ? "md:hidden" : ""}>Ranking</span>
          </button>
          <button
            onClick={() => setIsModalSummaryOpen(true)}
            title="Balance total"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition ${sidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
          >
            <FiPieChart size={18} /> <span className={sidebarCollapsed ? "md:hidden" : ""}>Balance total</span>
          </button>
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
            className={`hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition ${sidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
          >
            {sidebarCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
            <span className={sidebarCollapsed ? "md:hidden" : ""}>Contraer menú</span>
          </button>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition ${sidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            <span className={sidebarCollapsed ? "md:hidden" : ""}>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
          </button>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 dark:text-red-300 transition ${sidebarCollapsed ? "md:justify-center md:px-0" : ""}`}
          >
            <FiLogOut size={18} /> <span className={sidebarCollapsed ? "md:hidden" : ""}>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-white/90 border-b border-gray-200 dark:bg-gray-800/90 dark:border-gray-700 backdrop-blur px-4 md:px-6 py-3 md:py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              className="md:hidden text-gray-500 dark:text-gray-300 shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={22} />
            </button>
            <h1 className="text-lg md:text-xl font-bold truncate">
              {activeSection === "tickets"
                ? "Listado de Tickets"
                : "Gestión de la Rifa"}
            </h1>
          </div>
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            <div className="text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
              Vendidos:{" "}
              <span
                role="button"
                tabIndex={0}
                onClick={() => setShowSold(!showSold)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setShowSold(!showSold);
                }}
                className="cursor-pointer font-bold text-green-600 dark:text-green-400"
              >
                {showSold ? soldFormatted : "*****"}
              </span>
            </div>
            {activeSection === "tickets" && (
              <button
                type="button"
                onClick={handleSearchTicket}
                title="Verificar si un número exacto ya fue vendido en toda la base de datos"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition whitespace-nowrap"
              >
                <FiSearch size={15} /> <span className="hidden sm:inline">Verificar Números</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowSold(!showSold)}
              title={showSold ? "Ocultar información sensible" : "Mostrar información sensible"}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-200 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition whitespace-nowrap"
            >
              {showSold ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              <span className="hidden sm:inline">{showSold ? "Ocultar info sensible" : "Mostrar info sensible"}</span>
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 flex-1">
          {activeSection === "tickets" && (
            <>
              {/* Estadísticas */}
              <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
                <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl sm:rounded-2xl p-2.5 sm:p-5">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 text-[11px] sm:text-sm mb-1">
                    <FiTag /> <span className="truncate">Vendidos</span>
                  </div>
                  {statsLoading ? (
                    <Skeleton height={22} width={60} />
                  ) : (
                    <p className="text-base sm:text-2xl font-extrabold text-green-600 dark:text-green-400 truncate">
                      {showSold ? soldFormatted : "*****"}
                    </p>
                  )}
                </div>
                <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl sm:rounded-2xl p-2.5 sm:p-5">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 text-[11px] sm:text-sm mb-1">
                    <FiGift /> <span className="truncate">Disponibles</span>
                  </div>
                  {statsLoading ? (
                    <Skeleton height={22} width={60} />
                  ) : (
                    <p className="text-base sm:text-2xl font-extrabold text-blue-600 dark:text-blue-300 truncate">
                      {availableTickets
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </p>
                  )}
                </div>
                <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-xl sm:rounded-2xl p-2.5 sm:p-5">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 text-[11px] sm:text-sm mb-1">
                    <FiPieChart /> <span className="truncate">% Vendido</span>
                  </div>
                  {statsLoading ? (
                    <Skeleton height={22} width={40} />
                  ) : (
                    <p className="text-base sm:text-2xl font-extrabold text-yellow-600 dark:text-yellow-400">
                      {percentSold}%
                    </p>
                  )}
                </div>
                <div className="hidden sm:flex bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-3 items-center gap-3">
                  {statsLoading ? (
                    <Skeleton circle height={80} width={80} />
                  ) : (
                    <div className="w-20 h-20 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            innerRadius={24}
                            outerRadius={38}
                            paddingAngle={2}
                            stroke="none"
                          >
                            <Cell fill="#22c55e" />
                            <Cell fill="#334155" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                      Vendidos
                    </p>
                    <p className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
                      Disponibles
                    </p>
                  </div>
                </div>
              </div>

              {/* Filtros */}
              <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-4 md:p-5 mb-6 space-y-4">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                      Buscar por número, nombre o email
                    </label>
                    <div className="relative">
                      <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="Ej: 01234, Pedro o pedro@gmail.com"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                      Estado
                    </label>
                    <select
                      value={filter}
                      onChange={(e) =>
                        setFilter(e.target.value as "all" | "pending")
                      }
                      className="w-full lg:w-44 px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="pending">Pendientes</option>
                    </select>
                  </div>

                  {filter === "all" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                        Método de pago
                      </label>
                      <select
                        value={paymentMethod || ""}
                        onChange={(e) =>
                          setPaymentMethod(
                            e.target.value === "" ? undefined : e.target.value,
                          )
                        }
                        className="w-full lg:w-44 px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white outline-none"
                      >
                        <option value="">Todos</option>
                        <option value="BDV">BDV</option>
                        <option value="zelle">Zelle</option>
                        <option value="binance">Binance</option>
                      </select>
                    </div>
                  )}

                  {filter === "all" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                        Orden
                      </label>
                      <select
                        value={orderTickets}
                        onChange={(e) => setOrderTickets(e.target.value)}
                        className="w-full lg:w-52 px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white outline-none"
                      >
                        <option value="desc">Más recientes primero</option>
                        <option value="asc">Más antiguos primero</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 sm:items-end pt-3 border-t border-gray-200 dark:border-gray-700/60">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full sm:w-44 px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1.5">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full sm:w-44 px-3 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-900 dark:text-white outline-none"
                    />
                  </div>
                  {(dateFrom || dateTo || search) && (
                    <button
                      type="button"
                      onClick={() => {
                        setDateFrom("");
                        setDateTo("");
                        setSearch("");
                      }}
                      className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition sm:mb-2.5"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </div>

              {/* Tabla */}
              <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-3 md:p-4 overflow-x-auto">
                <table className="w-full border-collapse text-sm md:text-base">
                  <thead className="text-gray-600 bg-gray-100 dark:text-gray-200 dark:bg-gray-900/60">
                    <tr>
                      <th className="px-2 md:px-4 py-3 text-left rounded-l-lg">
                        Nombre
                      </th>
                      <th className="px-2 md:px-4 py-3">Tickets</th>
                      <th className="px-2 md:px-4 py-3">Referencia</th>
                      <th className="px-2 md:px-4 py-3">Método</th>
                      <th className="px-2 md:px-4 py-3">Monto</th>
                      <th className="px-2 md:px-4 py-3">Voucher</th>
                      <th className="px-2 md:px-4 py-3 rounded-r-lg">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isChangingTypes ? (
                      <tr>
                        <td colSpan={999} className="py-2">
                          <div className="space-y-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <Skeleton key={i} height={40} className="rounded-lg" />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredTickets.map((ticket, index) => (
                        <tr
                          key={index}
                          className="text-center border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition"
                        >
                          <td className="px-2 md:px-4 py-2 text-left">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(ticket)}
                              className="hover:underline text-left"
                              title="Ver detalle del ticket"
                            >
                              <span className="font-bold px-1 text-gray-400 dark:text-gray-500">
                                {index + 1}.
                              </span>{" "}
                              {ticket.fullName}
                            </button>
                          </td>
                          <td className="px-2 md:px-4 py-2">
                            {ticket.numberTickets}
                          </td>
                          <td className="px-2 md:px-4 py-2 underline">
                            {ticket.reference}
                          </td>
                          <td className="px-2 md:px-4 py-2">
                            {ticket.paymentMethod}
                          </td>
                          <td className="px-2 md:px-4 py-2">
                            {ticket?.amountPaid
                              ?.toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                            {ticket.paymentMethod === "BDV" ? "Bs" : "$"}
                          </td>
                          <td className="px-2 md:px-4 py-2">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(ticket.voucher)}
                              title="Ver comprobante"
                              aria-label="Ver comprobante"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-blue-600 dark:text-blue-300 hover:bg-blue-500/15 transition"
                            >
                              <FiEye size={16} />
                            </button>
                          </td>
                          <td className="px-2 md:px-4 py-2">
                            {ticket.approved ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenDetail(ticket)}
                                  title="Ver detalle"
                                  aria-label="Ver detalle"
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-500/15 transition"
                                >
                                  <FiInfo size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setModalEditEmail(true);
                                    setCurrentTikketSelected({
                                      email: ticket.email,
                                      id: ticket._id,
                                      phone: ticket.phone,
                                      numberTickets: ticket.numberTickets,
                                      paymentMethod: ticket.paymentMethod,
                                    });
                                  }}
                                  title="Editar datos del cliente"
                                  aria-label="Editar datos del cliente"
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-300 hover:bg-blue-500/15 transition"
                                >
                                  <FiEdit2 size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => submitTikketDenied(ticket._id)}
                                  title="Eliminar registro de ticket"
                                  aria-label="Eliminar registro de ticket"
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-danger hover:bg-danger/15 transition"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                                {resendEmailLoading ? (
                                  <Skeleton
                                    width={20}
                                    className="animate-pulse w-full rounded-full"
                                    height={20}
                                  />
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => submitResendEmail(ticket._id)}
                                    title="Reenviar email"
                                    aria-label="Reenviar email"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-300 hover:bg-blue-500/15 transition"
                                  >
                                    <FiSend size={16} />
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center gap-2 w-full">
                                <div className="flex flex-nowrap items-center justify-center gap-2 w-full">
                                  {loadingId === ticket._id ? (
                                    <Skeleton
                                      height={34}
                                      className="rounded-lg flex-1"
                                    />
                                  ) : (
                                    <Button
                                      variant="success"
                                      size="sm"
                                      icon={<FiCheck size={16} />}
                                      className="flex-1 min-w-[90px]"
                                      onClick={() =>
                                        submitTikketApprove(ticket._id)
                                      }
                                    >
                                      Aprobar
                                    </Button>
                                  )}
                                  {loadingId === ticket._id ? (
                                    <Skeleton
                                      height={34}
                                      className="rounded-lg flex-1"
                                    />
                                  ) : (
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      icon={<FiX size={16} />}
                                      className="flex-1 min-w-[90px]"
                                      onClick={() =>
                                        submitTikketDenied(ticket._id)
                                      }
                                    >
                                      Rechazar
                                    </Button>
                                  )}
                                </div>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDetail(ticket)}
                                    title="Ver detalle"
                                    aria-label="Ver detalle"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-500/15 transition"
                                  >
                                    <FiInfo size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setModalEditEmail(true);
                                      setCurrentTikketSelected({
                                        email: ticket.email,
                                        id: ticket._id,
                                        phone: ticket.phone,
                                        numberTickets: ticket.numberTickets,
                                        paymentMethod: ticket.paymentMethod,
                                      });
                                    }}
                                    title="Editar datos del cliente"
                                    aria-label="Editar datos del cliente"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-blue-600 dark:text-blue-300 hover:bg-blue-500/15 transition"
                                  >
                                    <FiEdit2 size={16} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {isLoadingPagination && !isChangingTypes && (
                  <div className="flex flex-col items-center justify-center my-10 p-5 text-center">
                    <div className="relative w-10 h-10 mb-4">
                      <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 dark:border-white"></div>
                      <div className="absolute inset-0 rounded-full border-t-4 border-gray-400 dark:border-white animate-spin"></div>
                    </div>
                    <small className="text-gray-500 dark:text-gray-300">Cargando mas</small>
                  </div>
                )}

                <div className="flex justify-center items-center gap-4 mt-4 p-3">
                  <span className="font-semibold text-gray-500 dark:text-gray-400">
                    Página {pageTickets}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<FiChevronRight size={18} />}
                    className="flex-row-reverse"
                    onClick={() => {
                      if (!isLastPage) setPageTickets((prev) => prev + 1);
                    }}
                    disabled={isLastPage}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </>
          )}

          {activeSection === "rifa" && (
            <div className="max-w-xl mx-auto space-y-6 flex flex-col justify-center min-h-[calc(100vh-160px)]">
              <div className="bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-2xl overflow-hidden">
                {raffleActually?.images?.[0] && (
                  <div className="w-full h-64 sm:h-80 bg-gray-100 dark:bg-black/40">
                    <img
                      src={
                        raffleActually.images[0].includes("uploads/")
                          ? raffleActually.images[0].split("uploads/")[1]
                          : raffleActually.images[0]
                      }
                      alt={raffleActually.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    {!raffleActually?.images?.[0] && (
                      <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400 shrink-0">
                        <FiGift size={28} />
                      </span>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {raffleActually?.name || "Sin rifa activa"}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {raffleActually?.description ||
                          "Crea una rifa para empezar a vender."}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
                          Precio: {raffleActually?.ticketPrice || "—"}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300 text-xs font-semibold">
                          Mínimo: {raffleActually?.minValue ?? "—"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            raffleActually?.visible
                              ? "bg-success/15 text-green-600 dark:text-green-400"
                              : "bg-danger/15 text-red-600 dark:text-red-400"
                          }`}
                        >
                          {raffleActually?.visible ? "● Visible" : "● Oculta"}
                        </span>
                      </div>

                      {raffleActually?.prizes && raffleActually.prizes.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {raffleActually.prizes.map((prize, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-300 text-xs font-medium"
                            >
                              {prize.title || `Premio ${i + 1}`}
                              {prize.amount ? `: ${prize.amount}` : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {raffleActually?.name ? (
                  <Button
                    variant="primary"
                    icon={<FiEdit3 />}
                    onClick={() => setModalUpdateRaffle(true)}
                  >
                    Actualizar rifa
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    icon={<FiPlus />}
                    onClick={() => setModalCreateRaffle(true)}
                  >
                    Crear nueva rifa
                  </Button>
                )}
                <Button
                  variant="danger"
                  icon={raffleActually?.visible ? <FiEyeOff /> : <FiEye />}
                  onClick={() => clickedRaffleVisibility()}
                >
                  {raffleActually?.visible ? "Ocultar rifa" : "Mostrar rifa"}
                </Button>
                {raffleActually?.name && (
                  <Button
                    variant="outline"
                    icon={<FiTrash2 />}
                    className="sm:col-span-2 !text-danger !border-danger/40 hover:!bg-danger/10"
                    onClick={() => clickedDeleteRaffle()}
                  >
                    Eliminar rifa actual
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modales */}
      <EditDollarModal
        isOpen={isModalDollarOpen}
        onClose={() => setIsModalDollarOpen(false)}
      />
      <TopBuyersModal
        isOpen={isModalBuyersOpen}
        onClose={() => setIsModalBuyersOpen(false)}
        theme={theme}
      />
      <MoneySummaryModal
        isOpen={isModalSummaryOpen}
        onClose={() => setIsModalSummaryOpen(false)}
      />

      {modalCreateRaffle && (
        <CreateRaffleModal
          isOpen={modalCreateRaffle}
          onClose={() => setModalCreateRaffle(false)}
        ></CreateRaffleModal>
      )}

      {modalUpdateRaffle && (
        <UpdateRaffleModal
          isOpen={modalUpdateRaffle}
          onClose={() => setModalUpdateRaffle(false)}
          existingRaffle={raffleActually}
        ></UpdateRaffleModal>
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

      <TicketDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        ticket={detailTicket}
        onViewVoucher={handleOpenModal}
      />
    </div>
    </div>
  );
}

export default Panel;
