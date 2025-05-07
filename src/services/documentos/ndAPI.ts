/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  NotaDebitoCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoND,
  ResponseListaND,
  ResponseSearchTercero,
  Tercero,
} from "../types";

export const getListaND = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaND> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/nd?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoND = async (id: string): Promise<ResponseInfoND> => {
  return await client.get<{
    data: NotaDebitoCabecera;
    status: string;
  }>(`documentos/nd/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearND = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/nd", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateND = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/nd/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/nd-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoND = async (data: any): Promise<any> => {
  return await client.post("documentos/nd-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchTercero = async (
  query: string,
  bodega_id: string
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/nd-tercero/${query}/${bodega_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (nd_id: string): Promise<any> => {
  return await client.get(`documentos/nd-pdf/${nd_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (nd_id: string): Promise<any> => {
  return await client.get(`documentos/nd-excel/${nd_id}`, {
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
