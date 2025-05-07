/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ConsignacionCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoCGN,
  ResponseListaCGN,
  ResponseSearchTercero,
  Tercero,
} from "../types";

export const getListaCGN = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string,
  signal?: AbortSignal
): Promise<ResponseListaCGN> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/cgn?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      signal,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoCGN = async (id: string): Promise<ResponseInfoCGN> => {
  return await client.get<{
    data: ConsignacionCabecera;
    status: string;
  }>(`documentos/cgn/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearCGN = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/cgn", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateCGN = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/cgn/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/cgn-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteLoteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/cgn-delete-lote", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoCGN = async (data: any): Promise<any> => {
  return await client.post("documentos/cgn-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPDF = async (cgn_id: string): Promise<any> => {
  return await client.get(`documentos/cgn-pdf/${cgn_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchTercero = async (
  query: string
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/cgn-tercero/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const validarAccesoDocumento = async (
  codigo_documento: string,
  id_empresa: string
): Promise<ResponseDocumento> => {
  const data = {
    codigo_documento,
    id_empresa,
  };
  return await client.post<{ data: Privilegios; status: string }>(
    "validar-documento",
    data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
