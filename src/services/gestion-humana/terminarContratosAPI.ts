/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseContratoTerminado } from "../types";

export const getTerminarContratos = async (): Promise<ResponseContratoTerminado> => {
  return await client_gestion.get("terminarcontratos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearTerminarContrato = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("terminarcontratos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTerminarContrato = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`terminarcontratos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateTerminarContrato = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`terminarcontratos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const generarPazYSalvo = async (id: any): Promise<any> => {
  return await client_gestion.get<any>("pazysalvos/" + id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const uploadSoportesAliados = async (data: any): Promise<any> => {
  return await client_gestion.post(`pazysalvos/upload`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const downloadPazYSalvo = async (id: string): Promise<any> => {

  return await client_gestion.get<any>(
    `pazysalvos/download-file/${id}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};