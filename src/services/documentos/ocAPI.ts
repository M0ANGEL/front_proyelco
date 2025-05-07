/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  OrdenCompraCabecera,
  Privilegios,
  ResponseDocumento,
  ResponseInfoOC,
  ResponseListaOC,
  ResponseOCxRQP,
} from "../types";

export const getListaOC = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaOC> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/oc?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getListaOCDestinos = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaOC> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/oc-destinos?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoOC = async (id: string): Promise<ResponseInfoOC> => {
  return await client.get<{ data: OrdenCompraCabecera; status: string }>(
    `documentos/oc/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearOC = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/oc", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateOC = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/oc/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoOC = async (data: any): Promise<any> => {
  return await client.post("documentos/oc-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getOCxRQP = async (rqp_id: string): Promise<ResponseOCxRQP> => {
  return await client.get<{ data: OrdenCompraCabecera[]; status: string }>(
    `documentos/oc/rqp-x-oc/${rqp_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (oc_id: string): Promise<any> => {
  return await client.get(`documentos/oc-pdf/${oc_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (data: any): Promise<any> => {
  return await client.post(`documentos/oc-excel`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcelSeguimiento = async (data: any): Promise<any> => {
  return await client.post(`documentos/rqp-seguimiento-excel`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getFormatoProveedor = async (oc_id: string): Promise<any> => {
  return await client.get(`documentos/oc-formato-proveedor/${oc_id}`, {
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
