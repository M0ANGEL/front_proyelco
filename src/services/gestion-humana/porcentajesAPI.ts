/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponsePocentaje } from "../types";

export const getPorcentajes = async (): Promise<ResponsePocentaje> => {
  return await client_gestion.get("porcentajes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearPorcentaje = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("porcentajes", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPorcentaje = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`porcentajes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updatePorcentaje = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`porcentajes/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusPorcentaje = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`porcentajes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};