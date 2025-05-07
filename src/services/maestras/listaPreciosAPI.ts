/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseListapre,
  ListaPrecios,
  ResponseInfoLP,
  ResponseListapreCli,
  ResponseInfoDetLP,
} from "../types";

import { Privilegios, ResponseDocumento } from "../types";

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

export const getListapre = async (): Promise<ResponseListapre> => {
  return await client.get<ListaPrecios[]>("listapre", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateListapre = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`listapre/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearListapreModulo = async (data: any): Promise<any> => {
  return await client.post<any>("perfiles-modulo", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusListapre = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`listapre/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusListapreCli = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`listaprecli/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDataImport = async (data: any): Promise<any> => {
  return await client.post<any>("listapre/import", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const createLP = async (data: any): Promise<any> => {
  return await client.post<any>("listapre", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateLP = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`listapre/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDLP = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`listapreDet/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoLP = async (id: string): Promise<ResponseInfoLP> => {
  return await client.get<{
    data: any;
    status: string;
    created_at: string | number | Date;
  }>(`listapre/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoDetLP = async (id: string): Promise<ResponseInfoLP> => {
  return await client.get<{
    data: any;
    status: string;
    created_at: string | number | Date;
  }>(`listapreDet/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const createLPC = async (data: any): Promise<any> => {
  return await client.post<any>("listaprecli", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateLPC = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`listaprecli/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDLPC = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`listapreDetCli/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoLPC = async (id: string): Promise<ResponseInfoLP> => {
  return await client.get<{
    data: ListaPrecios;
    status: string;
    created_at: string | number | Date;
  }>(`listaprecli/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDataImportCli = async (data: any): Promise<any> => {
  return await client.post<any>("listaprecli/import", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoDetLPC = async (id: any): Promise<ResponseInfoDetLP> => {
  return await client.get(`listapreDetCli/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListapreCli = async (): Promise<ResponseListapreCli> => {
  return await client.get<{ data: ListaPrecios[]; status: string }>(
    "listaprecli",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getExcelLP = async (id: string): Promise<any> => {
  return await client.get(`listapreciosprov/export/${id}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getExcelLPC = async (id: string): Promise<any> => {
  return await client.get(`listaprecioscli/export/${id}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const deteleDetalleListaPre = async (data: any, id: any) => {
  return await client.put<any>(`eliminar-listaprecio/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItemLP = async (data: any): Promise<any> => {
  return await client.post<any>("listapreciocli/lp-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteItemLPP = async (data: any): Promise<any> => {
  return await client.post<any>("listaprecio/lpp-delete-item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
