/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_tk } from "../client";
import { ResponseTkProcesos } from "../types";

//llamar todos las procesos
export const getTkProcesos = async (): Promise<ResponseTkProcesos> => {
  return await client_tk.get("admin-procesos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear el proceso
export const crearTkProceso = async (data: any): Promise<any> => {
  return await client_tk.post<any>("admin-procesos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver el proceso por id
export const getTkProceso = async (id: React.Key): Promise<any> => {
  return await client_tk.get<any>(`admin-procesos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar el proceso
export const updateTkProceso = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`admin-procesos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
