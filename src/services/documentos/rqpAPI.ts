/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Privilegios,
  ResponseDocumento,
  ResponseInfoRQP,
  ResponseListaRQP,
  ResponseListarRQP,
  Rqp,
} from "../types";

export const getListaRQP = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListarRQP> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/rqp?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPendientesRQP = async (): Promise<ResponseListaRQP> => {
  return await client.get<{ data: Rqp[]; status: string }>(
    `documentos/rqp-pendientes`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearRQP = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/rqp", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateRQP = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/rqp/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoRQP = async (id: string): Promise<ResponseInfoRQP> => {
  return await client.get<{ data: Rqp; status: string }>(
    `documentos/rqp/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const cambiarEstadoRQP = async (data: any): Promise<any> => {
  return await client.post("documentos/rqp-estado", data, {
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

export const getPDF = async (rqp_id: string): Promise<any> => {
  return await client.get(`documentos/rqp-pdf/${rqp_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (
  rqp_id: string,
  bodega_id: string,
  initialDate = "",
  endDate = ""
): Promise<any> => {
  return await client.get(
    initialDate == "" && endDate == ""
      ? `documentos/rqp-excel/${rqp_id}/${bodega_id}`
      : `documentos/rqp-excel/${rqp_id}/${bodega_id}/${initialDate}/${endDate}`,
    {
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadTemplate = async (filename: string): Promise<any> => {
  return await client.get(`downloadTemplate/${filename}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
