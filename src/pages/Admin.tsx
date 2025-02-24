import { authentication } from "@/services";
import { fetchAuth } from "@/utils/auth";
import { ResponseAuthType } from "@/utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAuth(navigate);
  }, [navigate]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const responseAuth: ResponseAuthType = await authentication(token);
      localStorage.setItem("token", responseAuth.token);
      navigate("/admin/panel");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4"
      >
        <input
          type="text"
          placeholder="Ingrese el token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border text-black p-2 rounded-md text-center"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Admin;
