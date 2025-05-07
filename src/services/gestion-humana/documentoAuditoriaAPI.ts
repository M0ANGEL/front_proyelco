/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseDocumentosAuditoriaGH } from "../types";

export const getDocumentoAuditorias = async (): Promise<ResponseDocumentosAuditoriaGH> => {
  return await client_gestion.get("documentoauditoria", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDocumentoAuditoria = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("documentoauditoria", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDocumentoAuditoria = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`documentoauditoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDocumentoAuditoria = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`documentoauditoria/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};