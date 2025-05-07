/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponsePension } from "../types";

export const getPensiones = async (): Promise<ResponsePension> => {
  return await client_gestion.get("pensiones", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearPension = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("pensiones", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPension = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`pensiones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusPension = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`pensiones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updatePension = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`pensiones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPensionesActivas = async (): Promise<ResponsePension> => {
  return await client_gestion.get("pensionesactivas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};