/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_aistencia } from "../client";
import { ResponseMaLink } from "../types";

//llamar todos los link activos
export const getLinkDescargas = async (): Promise<ResponseMaLink> => {
  return await client_aistencia.get("link-descargas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//crear link
export const crearMaLink = async (data: any): Promise<any> => {
  return await client_aistencia.post<any>("link-descargas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//cambiar el estado del link 
export const DeleteMaLink = async ( id: any): Promise<any> => {
  return await client_aistencia.delete<any>(`link-descargas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};