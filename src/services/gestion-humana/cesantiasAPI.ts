/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseCesantia } from "../types";

export const getCesantias = async (): Promise<ResponseCesantia> => {
  return await client_gestion.get("cesantias", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearCesantia = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("cesantias", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getCesantia = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`cesantias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateCesantia = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`cesantias/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusCesantia = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`cesantias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getCesantiasActivas = async (): Promise<ResponseCesantia> => {
  return await client_gestion.get("cesantiasactivas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
