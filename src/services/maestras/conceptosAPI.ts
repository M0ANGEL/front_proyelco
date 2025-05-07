/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { Bodega, BodxUsu, Concepto, ResponseBodega, ResponseBodxusu, ResponseConcepto, ResponseConceptos } from "../types";

export const getConceptos = async (): Promise<ResponseConceptos> => {
  return await client.get<{ data: Concepto[]; status: string }>("conceptos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusConcepto = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`conceptos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getConcepto = async (id: string): Promise<ResponseConcepto> => {
  return await client.get<{ data: Concepto; status: string }>(`conceptos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearConcepto = async (data: any): Promise<any> => {
  return await client.post<any>("conceptos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateConcepto = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`conceptos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getBodDestino = async (id: string): Promise<ResponseBodega> => {
  return await client.get<{ data: Bodega; status: string }>(`bod-destino/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getBodxusu= async (): Promise<ResponseBodxusu> => {
  return await client.get<{ data: BodxUsu; status: string }>(`bodxusu`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
