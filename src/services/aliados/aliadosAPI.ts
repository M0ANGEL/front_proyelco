/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ResponseDispensacionesAliadosListPag,
  ResponseDispensacionAliados,
  ResponseAliadoListPag,
  ResponseUserAliado,
  ResponseAliados,
  ResponseAliado,
  ResponseTrazabilidadDispensacionAliados,
} from "../types";
import { client } from "../client";

export const getListadoAliadosPag = async (
  data: any
): Promise<ResponseAliadoListPag> => {
  return await client.post("aliados/listar-aliados-pag", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getAliados = async (): Promise<ResponseAliados> => {
  return await client.get(`aliados`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getAliadoInfo = async (id: string): Promise<ResponseAliado> => {
  return await client.get(`aliados/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getUserAliado = async (): Promise<ResponseUserAliado> => {
  return await client.get(`aliados/get/user-aliado`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearAliado = async (data: any): Promise<any> => {
  return await client.post<any>("aliados", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const createDispensacionesAliados = async (data: any): Promise<any> => {
  return await client.post<any>("aliados/save-dispensaciones", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateAliado = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`aliados/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusAliado = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`aliados/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListadoDispensacionesPag = async (
  data: any
): Promise<ResponseDispensacionesAliadosListPag> => {
  return await client.post("aliados/listar-dispensaciones-pag", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDispensacionAliado = async (
  id: React.Key
): Promise<ResponseDispensacionAliados> => {
  return await client.get(`aliados/get/dis-aliado/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoAliados = async (data: any): Promise<any> => {
  return await client.post("aliados/cambiar-estado-auditoria", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTrazabilidad = async (
  id: React.Key
): Promise<ResponseTrazabilidadDispensacionAliados> => {
  return await client.get(`aliados/get/dis-trazabilidad/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const generarInformeGeneral = async (data: any): Promise<any> => {
  return await client.post(`aliados/generar-informe-general`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const generarInformeTrazabilidad = async (data: any): Promise<any> => {
  return await client.post(`aliados/generar-informe-trazabilidad`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const uploadSoportesAliados = async (data: any): Promise<any> => {
  return await client.post(`aliados/upload-soportes`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getSoportes = async (
  consecutivo: string,
  aliado_id: string,
  id: string
): Promise<any> => {
  return await client.get<{ data: string[]; status: string }>(
    `aliados/listar-soportes/${consecutivo}/${aliado_id}/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadSoporte = async (file: string): Promise<any> => {
  return await client.get<any>(
    `aliados/download-file/${encodeURIComponent(btoa(file))}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const deleteSoporte = async (file: string): Promise<any> => {
  return await client.get<any>(
    `aliados/delete-file/${encodeURIComponent(btoa(file))}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadZipAliados = async (data: any): Promise<any> => {
  return await client.post(`aliados/download-zip`, data, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
