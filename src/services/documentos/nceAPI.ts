/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  NotaCreditoFVEDisCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoFacturaDis,
  ResponseInfoNCE,
  ResponseListaNCE,
  ResponseSearchFVE,
  ResponseSearchTercero,
  Tercero,
} from "../types";

export const getListaNCE = async (
  page = 1,
  bodega_id: string,
  estado: number,
  query?: string,
  tipo_documento?: string
): Promise<ResponseListaNCE> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/nce?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}&tipo_documento=${tipo_documento}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getListaPagNCE = async (
  page = 1,
  bodega_id: string,
  estado: number,
  searchInput?: string,
  tipo_documento?: string,
  paginate = 10
): Promise<ResponseListaNCE> => {
  return await client.post(
    `documentos/nce-paginate`,
    { page, bodega_id, estado, searchInput, tipo_documento, paginate },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoNCE = async (id: string): Promise<ResponseInfoNCE> => {
  return await client.get<{
    data: NotaCreditoFVEDisCabecera;
    status: string;
  }>(`documentos/nce/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearNCE = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/nce", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateNCE = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/nce/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/nce-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoNCE = async (data: any): Promise<any> => {
  return await client.post("documentos/nce-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListaFVE = async (
  value: string
): Promise<ResponseSearchFVE> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/nce-search-fve?value=${value}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoFactura = async (
  value: string,
  convenios: string
): Promise<ResponseInfoFacturaDis> => {
  return await client.get(
    `documentos/nce-get-factura?factura=${value}&convenios=${convenios}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const searchTercero = async (
  query: string
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/nce-tercero/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (nce_id: string): Promise<any> => {
  return await client.get(`documentos/nce-pdf/${nce_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (nce_id: string): Promise<any> => {
  return await client.get(`documentos/nce-excel/${nce_id}`, {
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
