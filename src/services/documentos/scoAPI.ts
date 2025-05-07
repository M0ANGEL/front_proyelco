/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseSalidaConsignacion,
  ResponseSalidaConsignacionList,
  ResponseSalidaConsignacionListPag,
  ResponseSearchTercero,
} from "../types";

export const getListaSCO =
  async (): Promise<ResponseSalidaConsignacionList> => {
    return await client.get(`documentos/sco`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getListaPagSCO = async (
  data: any
): Promise<ResponseSalidaConsignacionListPag> => {
  return await client.post(`documentos/sco-lista-pag`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPDF = async (id: string): Promise<any> => {
  return await client.get(`documentos/sco/print/${id}`, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoSCO = async (
  id: string
): Promise<ResponseSalidaConsignacion> => {
  return await client.get(`documentos/sco/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearSCO = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/sco", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateSCO = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`documentos/sco/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoSCO = async (data: any): Promise<any> => {
  return await client.post("documentos/sco-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getProveedor = async (
  nit: string
): Promise<ResponseSearchTercero> => {
  return await client.get(`documentos/sco-proveedor/${nit}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
