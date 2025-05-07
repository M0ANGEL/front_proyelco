/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseTerceroTipo } from "../types";

export const getTerceroTipos = async (): Promise<ResponseTerceroTipo> => {
  return await client.get<{ data: any; status: string }>(`tercero-tipos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTerceroTipo = async (id: string): Promise<any> => {
  return await client.get<any>(`tercero-tipos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearTerceroTipo = async (data: any): Promise<any> => {
  return await client.post<any>("tercero-tipos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateTerceroTipo = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`tercero-tipos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusTerceroTipo = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`tercero-tipos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
