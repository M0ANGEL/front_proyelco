/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseActivosS } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getMisiActivosPendientes = async (): Promise<ResponseActivosS> => {
  return await client.get("mis-activos-pendientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const getMisiActivos = async (): Promise<ResponseActivosS> => {
  return await client.get("mis-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
