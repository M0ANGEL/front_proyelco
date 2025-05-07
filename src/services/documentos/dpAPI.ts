/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  DevolucionProveedorCabecera,
  ResponseInfoDP,
  ResponseListaDP,
} from "../types";

export const getListaDP = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string,
  tipo_documento_id?: string,
): Promise<ResponseListaDP> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/dp?page=${page}&bodega_id=${bodega_id}&tipo_documento_id=${tipo_documento_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
};

export const getPDF = async (
  id: string
): Promise<any> => {
  return await client.get(`documentos/dp/print/${id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoDP = async (id: string): Promise<ResponseInfoDP> => {
  return await client.get<{
    data: DevolucionProveedorCabecera;
    status: string;
  }>(`documentos/dp/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDP = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/dp", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDP = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/dp/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoDP = async (data: any): Promise<any> => {
  return await client.post("documentos/dp-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
