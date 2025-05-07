/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponsePerfil } from "../types";

export const getPerfiles = async (): Promise<ResponsePerfil> => {
  return await client.get("perfil", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearPerfil = async (data: any): Promise<any> => {
  return await client.post<any>("perfil", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPerfil = async (id: string): Promise<any> => {
  return await client.get<any>(`perfil/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updatePerfil = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`perfil/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearPerfilModulo = async (data: any): Promise<any> => {
  return await client.post<any>("perfiles-modulo", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusPerfil = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`perfil/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};