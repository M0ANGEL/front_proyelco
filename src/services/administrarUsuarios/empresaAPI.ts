/* eslint-disable @typescript-eslint/no-explicit-any */
import { Empresa, ResponseEmpresas } from "@/types/typesGlobal";
import { client } from "../client";

export const getEmpresas = async (): Promise<ResponseEmpresas> => {
  return await client.get<{ data: Empresa[]; status: string }>("empresas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const setStatusEmpresa = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`empresas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const getEmpresa= async (id: string): Promise<any> => {
  return await client.get<any>(`empresas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const crearEmpresa = async (data: any): Promise<any> => {
  return await client.post<any>("empresas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const updateEmpresa = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`empresas/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};