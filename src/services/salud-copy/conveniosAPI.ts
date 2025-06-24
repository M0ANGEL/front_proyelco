/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Convenio,
  ResponseConvenio,
  ResponseInfoConvenio,
  ResponseSearchConvenios,
} from "../types";

export const getConvenios = async (page = 1): Promise<ResponseConvenio> => {
  return await client.get(`convenios?page=${page}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getConveniosActivos = async (): Promise<any> => {
  return await client.get("convenios-on", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusConvenio = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`convenios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getConvenio = async (
  id: string
): Promise<ResponseInfoConvenio> => {
  return await client.get<{ data: Convenio; status: string }>(
    `convenios/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearConvenio = async (data: any): Promise<any> => {
  return await client.post<any>("convenios", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateConvenio = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`convenios/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getReportConvenios = async (): Promise<any> => {
  return await client.get(`convenios/reporte/all`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const searchConvenios = async (
  query: string,
  bodega_id: string
): Promise<ResponseSearchConvenios> => {
  return await client.get<{ data: Convenio[]; status: string }>(
    `convenios-search?value=${query}&bodega_id=${bodega_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getConveniosxNitBodega = async (
  data: any
): Promise<ResponseSearchConvenios> => {
  return await client.post<{ data: Convenio[]; status: string }>(
    `convenios-nit-bodega`,
    data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
