/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseGrupos } from "../types";

export const getGrupos = async (): Promise<ResponseGrupos> => {
  return await client.get("grupos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearGrupo = async (data: any): Promise<any> => {
  return await client.post<any>("grupos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getGrupo = async (id: string): Promise<any> => {
  return await client.get<any>(`grupos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateGrupo = async (
  data: any,
  id: any
): Promise<any> => {
  return await client.put<any>(`grupos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
