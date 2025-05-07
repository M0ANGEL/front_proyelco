/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseMotivoAuditoria, ResponseMotivosAuditoria } from "../types";

export const getMotivosAud = async (): Promise<ResponseMotivosAuditoria> => {
  return await client.get("motivos-auditoria", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearMotivoAud = async (data: any): Promise<any> => {
  return await client.post<any>("motivos-auditoria", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getMotivoAud = async (id: string): Promise<ResponseMotivoAuditoria> => {
  return await client.get(`motivos-auditoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateMotivoAud = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`motivos-auditoria/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusMotivoAud = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`motivos-auditoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


