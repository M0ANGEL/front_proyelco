/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseAusentismo } from "../types";

export const getAusentismos = async (): Promise<ResponseAusentismo> => {
  return await client_gestion.get("ausentismos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearAusentismo = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("ausentismos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getAusentismo = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`ausentismos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateAusentismo = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`ausentismos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};