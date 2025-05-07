/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseArl } from "../types";

export const index = async (): Promise<ResponseArl> => {
  return await client_gestion.get("arls", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const store = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("arls", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const edit = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`arls/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const update = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`arls/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};