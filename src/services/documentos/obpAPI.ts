/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ObsequioProveedorCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoOBP,
  ResponseListaOBP,
  ResponseSearchTercero,
  Tercero,
} from "../types";

export const getListaOBP = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaOBP> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/obp?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoOBP = async (id: string): Promise<ResponseInfoOBP> => {
  return await client.get<{
    data: ObsequioProveedorCabecera;
    status: string;
  }>(`documentos/obp/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearOBP = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/obp", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateOBP = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/obp/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/obp-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteLoteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/obp-delete-lote", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoOBP = async (data: any): Promise<any> => {
  return await client.post("documentos/obp-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPDF = async (obp_id: string): Promise<any> => {
  return await client.get(`documentos/obp-pdf/${obp_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchTercero = async (
  query: string
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/obp-tercero/${query}`,
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
