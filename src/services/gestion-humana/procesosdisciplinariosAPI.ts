/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseProcesoDisciplinario } from "../types";

export const getProcesosDisciplinarios = async (): Promise<ResponseProcesoDisciplinario> => {
  return await client_gestion.get("procesosdisciplinarios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearProcesoDisciplinario = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("procesosdisciplinarios", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getProcesosDisciplinario = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`procesosdisciplinarios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateProcesoDisciplinario = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`procesosdisciplinarios/${id}`, data, {
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

