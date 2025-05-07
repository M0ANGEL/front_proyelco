/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseEntidad } from "../types";

export const getEntidades = async (): Promise<ResponseEntidad> => {
  return await client.get("entidades", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearEntidades = async (data: any): Promise<any> => {
  return await client.post<any>("entidades", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getEntidad = async (id: string): Promise<any> => {
  return await client.get<any>(`entidades/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateEntidad = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`entidades/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusEntidad = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`entidades/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateCargo = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`cargos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusCargo = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`cargos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
