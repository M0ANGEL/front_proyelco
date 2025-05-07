/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseSearchConvenios,
  FacturaConceptoCabecera,
  ResponseSearchTercero,
  ResponseDocumento,
  ResponseListaFVC,
  ResponseInfoFVC,
  Privilegios,
  Convenio,
  Tercero,
} from "../types";

export const getListaFVC = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaFVC> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/fvc?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoFVC = async (id: string): Promise<ResponseInfoFVC> => {
  return await client.get<{
    data: FacturaConceptoCabecera;
    status: string;
  }>(`documentos/fvc/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearFVC = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/fvc", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateFVC = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/fvc/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/fvc-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoFVC = async (data: any): Promise<any> => {
  return await client.post("documentos/fvc-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchTercero = async (
  query: string
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/fvc-tercero/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getConvenios = async (
  bodega_id: string
): Promise<ResponseSearchConvenios> => {
  return await client.get<{ data: Convenio[]; status: string }>(
    `documentos/fvc-convenios/${bodega_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (fvc_id: string): Promise<any> => {
  return await client.get(`documentos/fvc-pdf/${fvc_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (fvc_id: string): Promise<any> => {
  return await client.get(`documentos/fvc-excel/${fvc_id}`, {
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

export const getConvenioRelacionado = async (): Promise<any> => {
  return await client.get<{ data:any; status: string }>(
    `documentos/fvc-convenio/relacionado`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
