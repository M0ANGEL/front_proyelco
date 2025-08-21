import { client } from "../client";
import { ResponseActivosS } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiAdministrarActivosAdmin = async (): Promise<ResponseActivosS> => {
  return await client.get("administar-activos-all", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiAdministrarActivosPendientesAdmin = async (): Promise<ResponseActivosS> => {
  return await client.get("administar-activos-pendientes-all", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};