/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseCabeceras } from "../types";

export const getCabeceras = async (): Promise<ResponseCabeceras> => {
  return await client.get("cabeceras", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusCabeceras = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`cabeceras/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getCabecera = async (id: string): Promise<any> => {
  return await client.get<any>(`cabeceras/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearCabeceras = async (data: any): Promise<any> => {
  return await client.post<any>("cabeceras", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateCabeceras = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`cabeceras/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
