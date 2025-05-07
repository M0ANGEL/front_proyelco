/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseIps } from "../types";

export const index = async (): Promise<ResponseIps> => {
  return await client_gestion.get("ips", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const store = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("ips", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const edit = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`ips/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const update = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`ips/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteIps = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`ips/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
