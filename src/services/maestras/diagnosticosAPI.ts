/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Diagnostico,
  ResponseDiagnostico,
  ResponseDiagnosticoSearch,
  ResponseDiagnosticos,
  ResponseSearchDiagnosticos,
} from "../types";

export const getDiagnosticos = async (): Promise<ResponseDiagnosticos> => {
  return await client.get<{ data: Diagnostico[]; status: string }>(
    "diagnosticos",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const setStatusDiagnostico = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`diagnosticos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDiagnostico = async (
  id: string
): Promise<ResponseDiagnostico> => {
  return await client.get<{ data: Diagnostico; status: string }>(
    `diagnosticos/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearDiagnostico = async (data: any): Promise<any> => {
  return await client.post<any>("diagnosticos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDiagnostico = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`diagnosticos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchDiagnosticos = async (
  query: string
): Promise<ResponseSearchDiagnosticos> => {
  return await client.get<{ data: any; status: string }>(
    `diagnosticos-search?value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const searchDiagnostico = async (
  query: string
): Promise<ResponseDiagnosticoSearch> => {
  return await client.get<{
    data: Diagnostico | Diagnostico[];
    status: string;
  }>(`diagnostico-search?value=${query}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
