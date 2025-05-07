/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseUser, ResponseUsers, UserData } from "../types";

export const getUsuarios = async (): Promise<ResponseUsers> => {
  return await client.get<{ data: UserData[]; status: string }>("usuarios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const validarUsuario = async (
  username: string
): Promise<ResponseUser> => {
  return await client.get<{ data: UserData }>(`usuarios/username/${username}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getUsuario = async (id: string): Promise<any> => {
  return await client.get<any>(`usuarios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearUsuario = async (data: any): Promise<any> => {
  return await client.post<any>("register", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const removerEmpBod = async (data: any): Promise<any> => {
  return await client.post<any>("removerItem", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusUser = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`usuarios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getReportUsuarios = async (): Promise<any> => {
  return await client.get(`usuarios/reporte/all`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const setStatusEmpresaUsuario = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`usuarios/empresas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusBodegaUsuario = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`usuarios/bodegas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateUsuario = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`usuarios/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
export const getReportUsuariosPermisos = async (): Promise<any> => {
  return await client.get(`usuarios/permisos/documentos`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getReportPerfilesModulos = async (): Promise<any> => {
  return await client.get(`perfiles/modulos`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const saveUserTipoDocumento = async (data: any): Promise<any> => {
  return await client.post(`users-documentos`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const deleteUserTipoDocumento = async (id: string): Promise<any> => {
  return await client.delete(`users-documentos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
