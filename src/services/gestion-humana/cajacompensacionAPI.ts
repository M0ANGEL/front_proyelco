/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client"
import { ResponseCajaCompensacion } from "../types"

export const getCajaCompensaciones= async (): Promise<ResponseCajaCompensacion> => {
  return await client_gestion.get("cajacompensacion", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearCajaCompensacion = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("compensaciones", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getCajaCompensacion = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`compensaciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateCajaCompensacion = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`compensaciones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusCajaCompensacion = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`compensaciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getCajaCompensacionActivas = async (): Promise<ResponseCajaCompensacion> => {
  return await client_gestion.get("compensacionactivas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};