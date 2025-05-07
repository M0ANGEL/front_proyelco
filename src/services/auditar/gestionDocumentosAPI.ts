/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseDocumentosAuditoria,
  ResponseSearchEstadosAud,
} from "../types";

export const getListaFacturaVtaDis = async (
  data: any
): Promise<ResponseDocumentosAuditoria> => {
  let url = "";
  data.data.numero_doc === "" || data.data.numero_doc === undefined
    ? (url = `auditoria/documentos/list`)
    : (url = `auditoria/listar-documentos`);
  return await client.post<any>(url, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getEstados = async (): Promise<ResponseSearchEstadosAud> => {
  return await client.get("auditoria/estados", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const downloadZip = async (data: any): Promise<any> => {
  return await client.post(`auditoria/images-dispensaciones`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const downloadZipFile = async (filename: string): Promise<any> => {
  return await client.get(`downloadZipFile/${filename}`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": 'application/zip' },
  });
};
