import { ResponseActivosS } from "@/types/typesGlobal";
import { client } from "../client";

export interface FiltroActivos {
  fecha_inicio: string;
  fecha_fin: string;
}

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiAdministrarActivosAdmin = async (): Promise<ResponseActivosS> => {
  return await client.get("administar-activos-all", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiAdministrarActivosPendientesAdmin = async (): Promise<ResponseActivosS> => {
  return await client.get("administar-activos-pendientes-all", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


export const exportReporteFiltrosActivos = async (filtros: FiltroActivos) => {
  return await client.post(`export-reporte-activos`, filtros, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
    responseType: "blob",
  });
};