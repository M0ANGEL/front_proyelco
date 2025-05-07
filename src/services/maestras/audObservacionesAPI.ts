/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponseAudObservacionesListPag,
  ResponseAudObservaciones,
  ResponseAudObservacion,
} from "../types";
import { client } from "../client";

export const getListadoAudObservacionesPag = async (
  data: any
): Promise<ResponseAudObservacionesListPag> => {
  return await client.post("observaciones-auditoria-pag", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getAudObservaciones =
  async (): Promise<ResponseAudObservaciones> => {
    return await client.get(`observaciones-auditoria`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getAudObservacionInfo = async (
  id: string
): Promise<ResponseAudObservacion> => {
  return await client.get(`observaciones-auditoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearAudObservacion = async (data: any): Promise<any> => {
  return await client.post<any>("observaciones-auditoria", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateAudObservacion = async (
  data: any,
  id: any
): Promise<any> => {
  return await client.put<any>(`observaciones-auditoria/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusAudObservacion = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`observaciones-auditoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
