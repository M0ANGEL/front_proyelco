/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  NotaCreditoConceptoCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoNCC,
  ResponseListaNCC,
  ResponseSearchTercero,
  Tercero,
} from "../types";

export const getListaNCC = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaNCC> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/ncc?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoNCC = async (id: string): Promise<ResponseInfoNCC> => {
  return await client.get<{
    data: NotaCreditoConceptoCabecera;
    status: string;
  }>(`documentos/ncc/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearNCC = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/ncc", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateNCC = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/ncc/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/ncc-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoNCC = async (data: any): Promise<any> => {
  return await client.post("documentos/ncc-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchTercero = async (
  query: string,
  bodega_id: string,
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/ncc-tercero/${query}/${bodega_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (ncc_id: string): Promise<any> => {
  return await client.get(`documentos/ncc-pdf/${ncc_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (ncc_id: string): Promise<any> => {
  return await client.get(`documentos/ncc-excel/${ncc_id}`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
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
