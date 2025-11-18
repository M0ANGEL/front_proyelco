import { ResponseActivosS } from "@/types/typesGlobal";
import { client } from "../client";

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