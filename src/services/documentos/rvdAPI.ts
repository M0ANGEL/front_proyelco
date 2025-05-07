/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Convenio,
  Privilegios,
  ProductoLote,
  RemisionVentaDirectaCabecera,
  ResponseDocumento,
  ResponseInfoRVD,
  ResponseListaRVD,
  ResponseProductosLote,
  ResponseSearchConvenios,
  ResponseSearchTercero,
  Tercero,
} from "../types";

export const getListaRVD = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaRVD> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/rvd?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoRVD = async (id: string): Promise<ResponseInfoRVD> => {
  return await client.get<{
    data: RemisionVentaDirectaCabecera;
    status: string;
  }>(`documentos/rvd/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearRVD = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/rvd", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateRVD = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/rvd/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/rvd-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoRVD = async (data: any): Promise<any> => {
  return await client.post("documentos/rvd-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchConvenios = async (
  query: string,
  bodega_id: string
): Promise<ResponseSearchConvenios> => {
  return await client.get<{ data: Convenio[]; status: string }>(
    `documentos/rvd-convenios/${query}/${bodega_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const searchTercero = async (
  query: string
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/rvd-tercero/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const searchLotes = async (
  query: string,
  bodega_id: string
): Promise<ResponseProductosLote> => {
  return await client.get<{ data: ProductoLote[]; status: string }>(
    `documentos/rvd-lotes/${encodeURIComponent(btoa(query))}/${bodega_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (rvd_id: string): Promise<any> => {
  return await client.get(`documentos/rvd-pdf/${rvd_id}`, {
    responseType: "arraybuffer",
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
