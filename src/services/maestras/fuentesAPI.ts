/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseListFuentes, ResponseInfoFuente } from "../types";

export const getFuentes = async (): Promise<ResponseListFuentes> => {
  return await client.get("fuentes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearFuente = async (data: any): Promise<any> => {
  return await client.post<any>("fuentes", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getFuente = async (id: string): Promise<ResponseInfoFuente> => {
  return await client.get(`fuentes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateFuente = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`fuentes/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusFuente = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`fuentes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
