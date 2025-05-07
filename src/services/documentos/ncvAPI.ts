/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  NotaCreditoFVERvdCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoNCV,
  ResponseListaNCV,
  ResponseSearchFVE,
  ResponseSearchTercero,
  Tercero,
} from "../types";

export const getListaNCV = async (
  page = 1,
  bodega_id: string,
  estado: number,
  query?: string
): Promise<ResponseListaNCV> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/ncv?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoNCV = async (id: string): Promise<ResponseInfoNCV> => {
  return await client.get<{
    data: NotaCreditoFVERvdCabecera;
    status: string;
  }>(`documentos/ncv/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearNCV = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/ncv", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateNCV = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/ncv/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/ncv-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoNCV = async (data: any): Promise<any> => {
  return await client.post("documentos/ncv-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListaFVE = async (value: string): Promise<ResponseSearchFVE> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/ncv-search-fve?value=${value}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const searchTercero = async (
  query: string,
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/ncv-tercero/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (nce_id: string): Promise<any> => {
  return await client.get(`documentos/ncv-pdf/${nce_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (nce_id: string): Promise<any> => {
  return await client.get(`documentos/ncv-excel/${nce_id}`, {
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
