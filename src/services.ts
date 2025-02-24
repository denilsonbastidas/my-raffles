import axios from "axios";

const API_URL = "http://localhost:5000";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const submitTicket = async (values: any) => {
  try {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    const response = await axios.post(`${API_URL}/api/tickets`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
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

export const getTickets = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/tickets`);
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
