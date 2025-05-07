/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  FacturaProveedorCabecera,
  ResponseInfoFP,
  ResponseListaFP,
  ResponseSearchFP,
} from "../types";

export const getListaFP = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaFP> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/fp?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoFP = async (id: string): Promise<ResponseInfoFP> => {
  return await client.get<{ data: FacturaProveedorCabecera; status: string }>(
    `documentos/fp/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearFP = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/fp", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateFP = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/fp/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoFP = async (data: any): Promise<any> => {
  return await client.post("documentos/fp-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchFacturaProveedor = async (
  query: string
): Promise<ResponseSearchFP> => {
  return await client.get<{ data: FacturaProveedorCabecera[]; status: string }>(
    `documentos/fp-search/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (fp_id: string): Promise<any> => {
  return await client.get(`documentos/fp-pdf/${fp_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getActa = async (fp_id: string): Promise<any> => {
  return await client.get(`documentos/fp-acta/${fp_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (data: any): Promise<any> => {
  return await client.post(`documentos/fp-excel`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
