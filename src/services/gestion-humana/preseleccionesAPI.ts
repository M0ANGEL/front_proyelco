/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseEstadoPreseleccion } from "../types";
import { ResponsePreseleccion } from "../types";

export const getEstadosPreseleccion = async (): Promise<ResponseEstadoPreseleccion> => {
  return await client_gestion.get("estadospreselecciones", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPreselecciones = async (): Promise<ResponsePreseleccion> => {
  return await client_gestion.get("preselecciones", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearPreselecciones = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("preselecciones", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPreseleccion = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`preselecciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updatePreseleccion = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`preselecciones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const uploadSoportesPreseleccion = async (data: any): Promise<any> => {
  return await client_gestion.post(`cargue-documentos`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};