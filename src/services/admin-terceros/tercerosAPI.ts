/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ProductoLP,
  ResponseSearchProductsxLP,
  ResponseSearchTerceros,
  ResponseTerceros,
  ResponseTiposDocumentosIdentificacion,
  Tercero,
  TiposDocumentosIdentificacion,
} from "../types";

export const getTerceros = async (
  page = 1,
  query?: string
): Promise<ResponseTerceros> => {
  return await client.get<{ data: any; status: string }>(
    `terceros?page=${page}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const setStatusTercero = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`terceros/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTercero = async (id: string): Promise<any> => {
  return await client.get<any>(`terceros/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearTercero = async (data: any): Promise<any> => {
  return await client.post<any>("terceros", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateTercero = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`terceros/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getReportTerceros = async (): Promise<any> => {
  return await client.get(`terceros/reporte/all`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const searchTerceros = async (
  query: string
): Promise<ResponseSearchTerceros> => {
  return await client.get<{ data: Tercero[]; status: string }>(
    `terceros-search/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const searchProductsxLP = async (
  id: string
): Promise<ResponseSearchProductsxLP> => {
  return await client.get<{ data: ProductoLP[]; status: string }>(
    `tercero-lp-products/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getTercerosList = async (): Promise<ResponseSearchTerceros> => {
  return await client.get<{ data: Tercero[]; status: string }>(
    `terceros-lista`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getTiposDocumentosIdentificacion = async (
  maestra: string
): Promise<ResponseTiposDocumentosIdentificacion> => {
  return await client.get<{
    data: TiposDocumentosIdentificacion[];
    status: string;
  }>(`tiposDocumentosIdentificacion?maestra=${maestra}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
