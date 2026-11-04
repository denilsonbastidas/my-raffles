import axios from "axios";
import { EXCHANGE_RATE } from "./utils/contants";
import {
  RaffleType,
  RaffleRecord,
  RaffleOption,
  TicketType,
} from "./utils/types";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://my-raffles-back-production.up.railway.app";
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.url?.startsWith(`${API_URL}/api/`)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const scope = (raffleId: string) => {
  if (!raffleId) throw new Error("Debe seleccionar una rifa.");
  return { params: { raffleId } };
};
const apiError = (error: unknown) =>
  new Error(
    axios.isAxiosError<{ error: string }>(error)
      ? error.response?.data.error || error.message
      : error instanceof Error
        ? error.message
        : "Error inesperado",
  );
// const API_URL = "http://localhost:5000";

type TicketSubmission = Pick<
  TicketType,
  | "raffleId"
  | "numberTickets"
  | "fullName"
  | "email"
  | "phone"
  | "reference"
  | "voucher"
> & {
  amountPaid: string | number;
  paymentMethod: string | undefined;
};

export const submitTicket = async (values: TicketSubmission) => {
  try {
    const response = await axios.post(`${API_URL}/api/tickets`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    throw apiError(error);
  }
};

export const submitUpdateRaffle = async (
  raffleData: RaffleType,
  raffleId: string,
) => {
  try {
    const response = await axios.put(`${API_URL}/api/raffles`, raffleData, {
      ...scope(raffleId),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al actualizar la rifa:", error);
    throw apiError(error);
  }
};

export const getTopBuyers = async (
  raffleId: string,
  mode: "today" | "yesterday" | "total" | "custom" = "total",
  startDate?: string,
  endDate?: string,
) => {
  try {
    let url = `${API_URL}/api/tickets/top-buyers/${mode}`;
    if (mode === "custom" && startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }

    const response = await axios.get(url, scope(raffleId));
    return response.data;
  } catch (error) {
    console.error("Error al obtener el top de compradores:", error);
    throw error;
  }
};

export const getMoneySummary = async (raffleId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/tickets/summary`,
      scope(raffleId),
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el top de compradores:", error);
    throw error;
  }
};

export const submitCreateRaffle = async (values: RaffleType) => {
  try {
    const response = await axios.post(`${API_URL}/api/raffles`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al enviar la rifa:", error);
    throw error;
  }
};

export const getRaffles = async (): Promise<RaffleRecord[]> => {
  try {
    const { data } = await axios.get(`${API_URL}/api/raffles`);
    return data.raffles;
  } catch (error) {
    console.error("Error getRaffle:", error);
    throw apiError(error);
  }
};

export const getAdminRaffle = async (
  raffleId?: string,
): Promise<RaffleRecord | null> => {
  try {
    const { data } = await axios.get<{ raffle: RaffleRecord | null }>(
      `${API_URL}/api/admin/raffles/current`,
      { params: { raffleId } },
    );
    return data.raffle;
  } catch (error) {
    throw apiError(error);
  }
};

export const getAdminRaffleCatalog = async (): Promise<RaffleOption[]> => {
  try {
    const { data } = await axios.get<{ raffles: RaffleOption[] }>(
      `${API_URL}/api/admin/raffles`,
    );
    return data.raffles;
  } catch (error) {
    throw apiError(error);
  }
};

export const getTicketVoucher = async (
  id: string,
  raffleId: string,
): Promise<string> => {
  try {
    const { data } = await axios.get<{ voucher: string }>(
      `${API_URL}/api/tickets/${id}/voucher`,
      scope(raffleId),
    );
    return data.voucher;
  } catch (error) {
    throw apiError(error);
  }
};

export const deleteTicket = async (
  id: string,
  raffleId: string,
): Promise<{
  approved: boolean;
  rejected: boolean;
  releasedNumbers: number;
}> => {
  try {
    const { data } = await axios.delete(
      `${API_URL}/api/tickets/${id}`,
      scope(raffleId),
    );
    return data;
  } catch (error) {
    throw apiError(error);
  }
};

export const closeRaffle = async (raffleId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/raffles/close`,
      {},
      scope(raffleId),
    );
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la rifa:", error);
    throw apiError(error);
  }
};

export const getTickets = async (
  raffleId: string,
  filter: "all" | "pending" = "pending",
  paymentMethod?: string,
  pageTickets?: number,
  orderTickets?: string,
  signal?: AbortSignal,
): Promise<TicketType[]> => {
  try {
    const params = new URLSearchParams();
    params.append("raffleId", raffleId);

    if (filter === "all") {
      params.append("status", "all");
    }

    if (paymentMethod) {
      params.append("paymentMethod", paymentMethod);
    }

    if (pageTickets) {
      params.append("page", pageTickets.toString());
    }

    if (orderTickets) {
      params.append("order", orderTickets.toString());
    }

    params.append("numbertoshow", "150");

    const url = `${API_URL}/api/tickets?${params.toString()}`;
    const { data } = await axios.get<TicketType[]>(url, { signal });
    return data;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    console.error("Error getTickets:", error);
    throw apiError(error);
  }
};

export const authentication = async (token: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/admin/auth`, { token });
    return data;
  } catch (error) {
    console.error("Error authentication:", error);
    throw new Error("Error autenticación");
  }
};

export const tikketApprove = async (id: string, raffleId: string) => {
  try {
    const { data } = await axios.post<{
      approvalCodes: string[];
      emailDelivery: TicketType["emailDelivery"];
    }>(`${API_URL}/api/tickets/approve/${id}`, {}, scope(raffleId));
    return data;
  } catch (error) {
    console.error("Error tikketApprove:", error);
    throw apiError(error);
  }
};

export const tikketDenied = async (id: string, raffleId: string) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/tickets/reject/${id}`,
      {},
      scope(raffleId),
    );
    return data;
  } catch (error) {
    console.error("Error tikketDenied:", error);
    throw apiError(error);
  }
};

export const raffleVisibility = async (raffleId: string) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/raffles/toggle-visibility`,
      {},
      scope(raffleId),
    );
    return data;
  } catch (error) {
    console.error("Error raffleVisibility:", error);
    throw apiError(error);
  }
};

export const getParallelDollar = async () => {
  const fallbackData = {
    priceEnparalelovzla: EXCHANGE_RATE + 2,
  };

  try {
    const res = await fetch(`${API_URL}/api/dollar`);

    if (!res.ok) {
      throw new Error("Respuesta no válida del servidor");
    }
    const data = await res.json();
    return { priceEnparalelovzla: parseFloat(data.priceVez) };
  } catch (error) {
    console.error("Error getParallelDollar:", error);
    return fallbackData;
  }
};

export const updateParallelDollar = async (newPrice: String) => {
  try {
    const res = await fetch(`${API_URL}/api/dollar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceVez: newPrice.toString() }),
    });

    if (!res.ok) {
      throw new Error("Error al actualizar el precio del dólar");
    }

    const data = await res.json();
    return {
      success: true,
      updated: parseFloat(data.dollar.priceVez),
    };
  } catch (error) {
    console.error("Error updateParallelDollar:", error);
    return {
      success: false,
      error: "No se pudo actualizar el precio del dólar",
    };
  }
};

export const resendEmail = async (id: string, raffleId: string) => {
  try {
    const { data } = await axios.post<{
      emailDelivery: TicketType["emailDelivery"];
    }>(`${API_URL}/api/tickets/resend/${id}`, {}, scope(raffleId));
    return data;
  } catch (error) {
    console.error("Error resendEmail:", error);
    throw apiError(error);
  }
};

export const getEmailStatuses = async (
  ids: string[],
  raffleId: string,
  signal?: AbortSignal,
) => {
  try {
    const { data } = await axios.get<{
      tickets: Pick<TicketType, "_id" | "emailDelivery">[];
    }>(`${API_URL}/api/tickets/email-status`, {
      ...scope(raffleId),
      params: { raffleId, ids: ids.join(",") },
      signal,
    });
    return data.tickets;
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    throw apiError(error);
  }
};

export const updatedUser = async (
  id: string,
  newEmail: string | undefined,
  newPhone: string | undefined,
  numberTickets: number | undefined,
  paymentMethod: string | undefined,
  raffleId: string,
) => {
  try {
    const { data } = await axios.put<{ ticket: TicketType }>(
      `${API_URL}/api/tickets/update-contact/${id}`,
      {
        newEmail,
        newPhone,
        numberTickets,
        paymentMethod,
      },
      scope(raffleId),
    );
    return data;
  } catch (error) {
    console.error("Error updatedEmail:", error);
    throw apiError(error);
  }
};

export const checkApprovedTickets = async (email: string, raffleId: string) => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/tickets/check`,
      {
        email,
      },
      scope(raffleId),
    );
    return data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Error al verificar tickets",
    );
  }
};

export const checkTicket = async (ticket: string, raffleId: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/tickets/check`, {
      params: { number: ticket, raffleId },
    });

    return data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Error al verificar tickets",
    );
  }
};

export const getSoldNumbers = async (raffleId: string) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/api/tickets/sold-numbers`,
      scope(raffleId),
    );
    return data;
  } catch (error) {
    console.error("Error getRaffle:", error);
    throw apiError(error);
  }
};
