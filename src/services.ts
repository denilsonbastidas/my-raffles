import axios from "axios";
import { EXCHANGE_RATE } from "./utils/contants";
import { RaffleType } from "./utils/types";

// const API_URL = "https://my-raffles-back-production.up.railway.app";
const API_URL = "http://localhost:5000";

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

export const getTopBuyers = async (mode: "today" | "total" = "total") => {
  try {
    const response = await axios.get(`${API_URL}/api/tickets/top-buyers/${mode}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el top de compradores:", error);
    throw error;
  }
};

export const getMoneySummary = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/tickets/summary`);
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

export const getRaffle = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/raffles`);
    return data;
  } catch (error) {
    console.error("Error getRaffle:", error);
    return null;
  }
};

export const getTickets = async (
  filter: "all" | "pending" = "pending",
  paymentMethod?: string,
  pageTickets?: number,
  orderTickets?: string
) => {
  try {
    const params = new URLSearchParams();

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
    priceEnparalelovzla: EXCHANGE_RATE + 2,
  };

  try {
    const res = await fetch(`${API_URL}/api/dollar`);

    if (!res.ok) { throw new Error("Respuesta no válida del servidor") }
    const data = await res.json();
    return { priceEnparalelovzla: parseFloat(data.priceVez) }

  } catch (error) {
    console.error("Error getParallelDollar:", error);
    return fallbackData;
  }
}

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
}

export const resendEmail = async (id: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/tickets/resend/${id}`);
    return data;
  } catch (error) {
    console.error("Error resendEmail:", error);
    throw new Error("Error resendEmail");
  }
};

export const updatedEmail = async (
  id: string,
  newEmail: string,
  newPhone: string,
) => {
  try {
    const { data } = await axios.put(
      `${API_URL}/api/tickets/update-contact/${id}`,
      {
        newEmail,
        newPhone,
      },
    );
    return data;
  } catch (error) {
    console.error("Error updatedEmail:", error);
    throw new Error("Error updatedEmail");
  }
};

export const checkApprovedTickets = async (email: string) => {
  try {
    const { data } = await axios.post(`${API_URL}/api/tickets/check`, {
      email,
    });
    return data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Error al verificar tickets",
    );
  }
};

export const checkTicket = async (ticket: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/tickets/check`, {
      params: { number: ticket },
    });

    return data.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Error al verificar tickets",
    );
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
