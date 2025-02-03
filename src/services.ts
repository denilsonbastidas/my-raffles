import axios from "axios";

const API_URL = "http://localhost:5000/api/tickets";

export const submitTicket = async (values) => {
  try {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    const response = await axios.post(API_URL, formData, {
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
