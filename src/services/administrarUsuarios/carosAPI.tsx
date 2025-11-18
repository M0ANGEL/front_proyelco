/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCargo } from "@/types/typesGlobal";
import { client } from "../client";

export const getCargos = async (): Promise<ResponseCargo> => {
  return await client.get("cargos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const crearCargo = async (data: any): Promise<any> => {
  return await client.post<any>("cargos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const getCargo = async (id: string): Promise<any> => {
  return await client.get<any>(`cargos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const updateCargo = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`cargos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const setStatusCargo = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`cargos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};
