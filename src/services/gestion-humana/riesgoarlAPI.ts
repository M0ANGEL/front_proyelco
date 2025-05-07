/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponsePension } from "../types";

export const getRiesgoArls = async (): Promise<ResponsePension> => {
  return await client_gestion.get("riesgoarls", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearRiesgoArl = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("riesgoarls", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getRiesgoArl = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`riesgoarls/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateRiesgoArl = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`riesgoarls/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusRiesgoArl = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`riesgoarls/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getRiesgoArlActivas = async (): Promise<ResponsePension> => {
  return await client_gestion.get("riesgoarlsactivas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};