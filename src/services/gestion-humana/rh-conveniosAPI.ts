/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseRhConvenios } from "../types";

export const crearRhConvenio = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("rh-convenios", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getRhConvenios = async (): Promise<ResponseRhConvenios> => {
  return await client_gestion.get("rh-convenios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getRhConvenio = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`rh-convenios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateRhConvenio = async (data:any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`rh-convenios/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusRhConvenio = async (id: React.Key): Promise<any> => {
  return await client_gestion.delete<any>(`rh-convenios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getRhConveniosActivos = async (): Promise<ResponseRhConvenios> => {
  return await client_gestion.get("rh-convenios-on", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};