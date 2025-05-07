/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseAlertaContrato, ResponseTotalAlertas } from "../types";

export const index = async (): Promise<ResponseAlertaContrato> => {
  return await client_gestion.get("alertacontratos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const store = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("alertacontratos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const edit = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`alertacontratos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const update = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`alertacontratos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusAlertaContrato = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`alertacontratos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTotalAlertas = async (): Promise<ResponseTotalAlertas> => {
  return await client_gestion.get("totalalertas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};