/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {  Laboratorios, ResponseLaboratorios} from "../types";

export const getLaboratorios = async (): Promise<ResponseLaboratorios> => {
  return await client.get<{ data: Laboratorios[]; status: string }>(
    `laboratorios`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const setStatusLab = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`laboratorios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearLaboratorio = async (data: any): Promise<any> => {
  return await client.post<any>("laboratorios", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getLaboratorio = async (
  id: string
): Promise<{ data: { status: string; data: Laboratorios } }> => {
  return await client.get<{ status: string; data: Laboratorios }>(
    `laboratorios/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
export const updateLaboratorio = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`laboratorios/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

