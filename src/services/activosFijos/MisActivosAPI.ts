/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseActivosS } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getMisiActivosPendientes = async (): Promise<ResponseActivosS> => {
  return await client.get("mis-activos-pendientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


export const getMisiActivos = async (): Promise<ResponseActivosS> => {
  return await client.get("mis-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};
