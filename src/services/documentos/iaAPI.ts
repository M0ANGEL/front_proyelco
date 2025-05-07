/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  InventarioAperturaCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoIA,
  ResponseListaIA,
} from "../types";

export const getListaIA = async (
  page = 1,
  tipo_documento_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaIA> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/ia?page=${page}&tipo_documento_id=${tipo_documento_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoIA = async (id: string): Promise<ResponseInfoIA> => {
  return await client.get<{
    data: InventarioAperturaCabecera;
    status: string;
  }>(`documentos/ia/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearIA = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/ia", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoIA = async (data: any): Promise<any> => {
  return await client.post("documentos/ia-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const downloadTemplate = async (filename: string): Promise<any> => {
  return await client.get(`downloadTemplate/${filename}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPDF = async (ia_id: string): Promise<any> => {
  return await client.get(`documentos/ia-pdf/${ia_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (ia_id: string, tipo_documento_id = '28'): Promise<any> => {
  return await client.get(`documentos/ia-excel/${ia_id}/${tipo_documento_id}`, {
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
