/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  DevolucionVentaDirectaCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoDRV,
  ResponseListaDRV,
  ResponseSearchTercero,
  Tercero,
} from "../types";

export const getListaDRV = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaDRV> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/drv?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoDRV = async (id: string): Promise<ResponseInfoDRV> => {
  return await client.get<{
    data: DevolucionVentaDirectaCabecera;
    status: string;
  }>(`documentos/drv/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDRV = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/drv", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDRV = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/drv/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/drv-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoDRV = async (data: any): Promise<any> => {
  return await client.post("documentos/drv-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPDF = async (drv_id: string): Promise<any> => {
  return await client.get(`documentos/drv-pdf/${drv_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchTercero = async (
  query: string,
  bodega_id: string
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/drv-tercero/${query}/${bodega_id}`,
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
