/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseTipoDocumento,
  ResponseTipoDocumentoEmpresa,
  ResponseTipoDocumentos,
} from "../types";

export const getTiposDocumentos = async (): Promise<ResponseTipoDocumentos> => {
  return await client.get("tipos_documentos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearTipoDocumento = async (data: any): Promise<any> => {
  return await client.post<any>("tipos_documentos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTipoDocumento = async (id: string): Promise<any> => {
  return await client.get<any>(`tipos_documentos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateTipoDocumento = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`tipos_documentos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusTipoDocumento = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`tipos_documentos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTipoDocumentoEmpresa = async (
  id: string
): Promise<ResponseTipoDocumentoEmpresa> => {
  return await client.get(`documentos/empresa/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTipoDocumentoByPrefijo = async (
  prefijo: string
): Promise<ResponseTipoDocumento> => {
  return await client.get(`info-tipo-documento/${prefijo}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
