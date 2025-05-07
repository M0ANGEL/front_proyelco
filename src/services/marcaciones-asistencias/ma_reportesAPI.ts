/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_aistencia } from "../client";
import {  ResponseTkProcesos, ResponseTkSubCategorias } from "../types";



//llamar todos los procesos
export const getMaBodegas = async (): Promise<ResponseTkProcesos> => {
  return await client_aistencia.get("ma-farmacias", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Servicio para obtener los usuarios de ese proceso
export const getTkUsuariosBodega = async (
  id: number
): Promise<ResponseTkSubCategorias> => {
  return await client_aistencia.get<any>(`ma-farmacias-usuarios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};