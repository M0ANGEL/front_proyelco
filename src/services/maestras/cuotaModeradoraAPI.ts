/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { CuotaModeradora, ResponseCuotaModeradora, ResponseCuotaModeradoras } from "../types";

export const getCuotaModeradoras = async (): Promise<ResponseCuotaModeradoras> => {
  return await client.get<{ data: CuotaModeradora[]; status: string }>("cuotasmoderadoras", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusCuotaModeradora = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`cuotasmoderadoras/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getCuotaModeradora = async (id: string): Promise<ResponseCuotaModeradora> => {
  return await client.get<{ data: CuotaModeradora; status: string }>(`cuotasmoderadoras/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearCuotaModeradora = async (data: any): Promise<any> => {
  return await client.post<any>("cuotasmoderadoras", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateCuotaModeradora= async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`cuotasmoderadoras/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

