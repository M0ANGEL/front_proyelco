/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseBanco } from "../types";


export const getBancos= async (): Promise<ResponseBanco> => {
  return await client_gestion.get("bancos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearBanco = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("bancos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getBanco = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`bancos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateBanco = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`bancos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusBanco = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`bancos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getBancoOn = async (): Promise<ResponseBanco> => {
  return await client_gestion.get("bancos-on", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

