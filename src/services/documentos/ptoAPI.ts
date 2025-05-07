/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ProductoTerminadoCabecera,
  ResponseSearchTercero,
  ResponseDocumento,
  ResponseListaPTO,
  ResponseInfoPTO,
  Privilegios,
  Tercero,
  Producto,
  ResponseSearchProductos,
} from "../types";

export const getListaPTO = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaPTO> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/pto?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoPTO = async (id: string): Promise<ResponseInfoPTO> => {
  return await client.get<{
    data: ProductoTerminadoCabecera;
    status: string;
  }>(`documentos/pto/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearPTO = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/pto", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updatePTO = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/pto/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/pto-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteLoteItem = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/pto-delete-lote", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoPTO = async (data: any): Promise<any> => {
  return await client.post("documentos/pto-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPDF = async (pto_id: string): Promise<any> => {
  return await client.get(`documentos/pto-pdf/${pto_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchTercero = async (
  query: string
): Promise<ResponseSearchTercero> => {
  return await client.get<{ data: Tercero; status: string }>(
    `documentos/pto-tercero/${query}`,
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

export const buscarProductoPTO = async (
  query: string,
  bodega_id: string
): Promise<ResponseSearchProductos> => {
  return await client.get<{ data: Producto[]; status: string }>(
    `documentos/pto/buscar-productos/${encodeURIComponent(
      btoa(query)
    )}/${bodega_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
