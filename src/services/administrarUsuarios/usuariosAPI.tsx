// services/administrarUsuarios/usuariosAPI.ts
import { client } from "../client";
import { ResponseUsers, ResponseUser } from "@/types/typesGlobal";

export const usuariosAPI = {
  getUsuarios: async (): Promise<ResponseUsers> => {
    const response = await client.get<ResponseUsers>("usuarios", {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  setStatusUser: async (id: number): Promise<any> => {
    const response = await client.delete(`usuarios/${id}`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  getUsuario: async (id: string): Promise<ResponseUser> => {
    const response = await client.get<ResponseUser>(`usuarios/${id}`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  crearUsuario: async (data: any): Promise<any> => {
    const response = await client.post("register", data, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  updateUsuario: async (data: any, id: number): Promise<any> => {
    const response = await client.put(`usuarios/${id}`, data, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  validarUsuario: async (username: string): Promise<ResponseUser> => {
    const response = await client.get<ResponseUser>(`usuarios/username/${username}`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  removerEmpBod: async (data: any): Promise<any> => {
    const response = await client.post("removerItem", data, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  setStatusEmpresaUsuario: async (id: number): Promise<any> => {
    const response = await client.delete(`usuarios/empresas/${id}`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  getReportPerfilesModulos: async (): Promise<any> => {
    const response = await client.get("perfiles/modulos", {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
    return response.data;
  },

  saveUserTipoDocumento: async (data: any): Promise<any> => {
    const response = await client.post("users-documentos", data, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  },

  deleteUserTipoDocumento: async (id: string): Promise<any> => {
    const response = await client.delete(`users-documentos/${id}`, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("auth_token")}` 
      }
    });
    return response.data;
  }
};

// Exportaciones individuales para compatibilidad
export const getUsuarios = usuariosAPI.getUsuarios;
export const setStatusUser = usuariosAPI.setStatusUser;
export const getUsuario = usuariosAPI.getUsuario;
export const crearUsuario = usuariosAPI.crearUsuario;
export const updateUsuario = usuariosAPI.updateUsuario;
export const validarUsuario = usuariosAPI.validarUsuario;
export const removerEmpBod = usuariosAPI.removerEmpBod;
export const setStatusEmpresaUsuario = usuariosAPI.setStatusEmpresaUsuario;
export const getReportPerfilesModulos = usuariosAPI.getReportPerfilesModulos;
export const saveUserTipoDocumento = usuariosAPI.saveUserTipoDocumento;
export const deleteUserTipoDocumento = usuariosAPI.deleteUserTipoDocumento;