/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { Modulo, ResponseModulo, ResponseModulos } from "../types";

export const getModulos = async (): Promise<ResponseModulos> => {
  return await client.get<Modulo[]>("modulo", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getModulo = async (id: string): Promise<ResponseModulo> => {
  return await client.get<Modulo>(`modulo/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearModulo = async (data: any): Promise<any> => {
  return await client.post<any>("modulo", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateModulo = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`modulo/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusModulo = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`modulo/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
