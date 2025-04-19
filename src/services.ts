import axios from "axios";
import { EXCHANGE_RATE } from "./utils/contants";
import { RaffleType } from "./utils/types";

const API_URL = "https://my-raffles-back-production.up.railway.app";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const submitTicket = async (values: any) => {
  try {
    const response = await axios.post(`${API_URL}/api/tickets`, values, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
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

export const getRaffle = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/raffles`);
    return data;
  } catch (error) {
    console.error("Error getRaffle:", error);
    return null;
  }
};

export const getTickets = async (filter: "all" | "pending" = "pending") => {
  try {
    const url =
      filter === "all"
        ? `${API_URL}/api/tickets?status=all`
        : `${API_URL}/api/tickets`;

    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("Error getTickets:", error);
    return null;
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

export const tikketApprove = async (id: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/tickets/approve/${id}`);
    return data;
  } catch (error) {
    console.error("Error tikketApprove:", error);
    throw new Error("Error tikketApprove");
  }
};

export const tikketDenied = async (id: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/tickets/reject/${id}`);
    return data;
  } catch (error) {
    console.error("Error tikketDenied:", error);
    throw new Error("Error tikketDenied");
  }
};

export const raffleVisibility = async () => {
  try {
    const { data } = await axios.post(
      `${API_URL}/api/raffles/toggle-visibility`,
    );
    return data;
  } catch (error) {
    console.error("Error raffleVisibility:", error);
    throw new Error("Error raffleVisibility");
  }
};

export const getParallelDollar = async () => {
  const fallbackData = {
    priceEnparalelovzla: EXCHANGE_RATE + 2, // !!! backup value !!!
  };

  try {
    const { data } = await axios.get("https://pydolarve.org/api/v2/dollar");
    if (data?.monitors?.enparalelovzla?.price) {
      const adjustedPrice =
        Math.round(data?.monitors?.enparalelovzla?.price) + 2;
      return { priceEnparalelovzla: adjustedPrice };
    }
    return fallbackData;
  } catch (error) {
    console.error("Error getParallelDollar:", error);
    return fallbackData; // Retornar respaldo en caso de error
  }
};

export const resendEmail = async (id: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/tickets/resend/${id}`);
    return data;
  } catch (error) {
    console.error("Error resendEmail:", error);
    throw new Error("Error resendEmail");
  }
};

export const updatedEmail = async (id: string, newEmail: string) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/api/tickets/update-email/${id}`,
      {
        newEmail,
      },
    );
    return data;
  } catch (error) {
    console.error("Error updatedEmail:", error);
    throw new Error("Error updatedEmail");
  }
};

export const getSoldNumbers = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/tickets/sold-numbers`);
    return data;
  } catch (error) {
    console.error("Error getRaffle:", error);
    return null;
  }
};
