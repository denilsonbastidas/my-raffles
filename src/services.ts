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
    console.error("Error en getTickets:", error);
    return null;
  }
};
