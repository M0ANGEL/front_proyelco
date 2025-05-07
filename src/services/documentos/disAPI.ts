/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseSearchDispensaciones,
  ResponseDispensaciones,
  ResponseSearchEntidad,
  ResponseDispensacion,
  ResponseSearchImages,
  ResponsePaginateDis,
  ResponseDespachos,
  ResponseDocumento,
  IDispensacion,
  Privilegios,
  Entidad,
  Images,
} from "../types";

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

export const getDispensaciones = async (): Promise<ResponseDispensaciones> => {
  return await client.get("dispensaciones", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusDispensacion = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`dispensaciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDispensacion = async (data: any): Promise<any> => {
  return await client.post<any>("dispensaciones", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateDispensacion = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`dispensaciones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchDispensaciones = async (
  searchData: any
): Promise<ResponseSearchDispensaciones> => {
  return await client.post(`dispensaciones-search`, searchData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListaDis = async (): Promise<ResponseDispensaciones> => {
  return await client.get<{ data: IDispensacion[]; status: string }>(
    `dispensaciones`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPaginateDis = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query: string,
  signal?: AbortSignal
): Promise<ResponsePaginateDis> => {
  return await client.get<{ data: any; status: string }>(
    `dispensaciones-paginate?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      signal,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getDispensacionPdf = async (
  dispensacion_id: string
): Promise<any> => {
  return await client.get(`dispensaciones/pdf/${dispensacion_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDispensacionTirillaPdf = async (
  dispensacion_id: string
): Promise<any> => {
  return await client.get(`dispensaciones/tirilla/pdf/${dispensacion_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoDis = async (id: string): Promise<ResponseDispensacion> => {
  return await client.get<{ data: IDispensacion; status: string }>(
    `dispensaciones/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const updateDIS = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`dispensaciones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDisLote = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`dispensaciones/${id}/delete-det`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoDocumento = async (data: any): Promise<any> => {
  return await client.post("dispensaciones/estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const anularDis = async (data: any): Promise<any> => {
  return await client.post("dispensaciones/anular", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDespachos = async (): Promise<ResponseDespachos> => {
  return await client.get("despachos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTotalDispensaciones = async (id: any): Promise<any> => {
  return await client.get<any>(`dispensaciones/total/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchEntidad = async (
  query: string
): Promise<ResponseSearchEntidad> => {
  return await client.get<{ data: Entidad[]; status: string }>(
    `entidad-search?value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getImages = async (
  consecutivo: string
): Promise<ResponseSearchImages> => {
  return await client.get<{ data: Images[]; status: string }>(
    `images-search/${consecutivo}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadFile = async (
  file: string,
  consecutivo: string
): Promise<any> => {
  return await client.get<any>(`downloadFile/${file}/${consecutivo}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteFile = async (id: string | number): Promise<any> => {
  return await client.get<any>(`dispensaciones-remover-adjunto/${id}`, {
    // responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const checkNumeroServinte = async (
  numero_servinte: any,
  id_fuente: any
): Promise<any> => {
  return await client.get(
    `dispensaciones-check-servinte/${numero_servinte}/${id_fuente}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
