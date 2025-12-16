/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseTkProcesos } from "../types";

//llamar todos las procesos
export const getTkProcesos = async (): Promise<ResponseTkProcesos> => {
  return await client.get("admin-procesos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear el proceso
export const crearTkProceso = async (data: any): Promise<any> => {
  return await client.post<any>("admin-procesos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver el proceso por id
export const getTkProceso = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`admin-procesos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar el proceso
export const updateTkProceso = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`admin-procesos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
