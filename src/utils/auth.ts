// utils/auth.ts
import { authentication } from "@/services";
import { NavigateFunction } from "react-router-dom";

export const fetchAuth = async (navigate: NavigateFunction) => {
  const tokenStorage = localStorage.getItem("token");

  if (!tokenStorage) {
    navigate("/admin");
    return;
  }

  try {
    await authentication(tokenStorage);
    navigate("/admin/panel");
  } catch (error) {
    console.error("Error en autenticación:", error);
    navigate("/admin");
  }
};
