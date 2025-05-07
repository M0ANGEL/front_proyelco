/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { Medico, ResponseListaMedicos, ResponseMedico, ResponseMedicos, ResponseSearchMedicos } from "../types";

export const getMedicos = async (): Promise<ResponseMedicos> => {
  return await client.get("medicos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusMedico = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`medicos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getMedico = async (id: string): Promise<ResponseMedico> => {
  return await client.get<{ data: Medico; status: string }>(`medicos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearMedico = async (data: any): Promise<any> => {
  return await client.post<any>("medicos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateMedico= async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`medicos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListaMedico = async (): Promise<ResponseListaMedicos> => {
  return await client.get<{ data: Medico[]; status: string }>("listar/medicos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const searchMedicos = async (
  query: string
): Promise<ResponseSearchMedicos> => {
  return await client.get<{ data: Medico; status: string }>(
    `medicos-search/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

