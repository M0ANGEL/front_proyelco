import { ResponseProyeccion } from "@/types/typesGlobal";
import { client } from "../client";

// Obtener todas las solicitudes que tengan pdf de sinco
export const getProyectosProyecionesLogistica =
  async (): Promise<ResponseProyeccion> => {
    return await client.get("proyectos-proyeccio-logistica", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
  };