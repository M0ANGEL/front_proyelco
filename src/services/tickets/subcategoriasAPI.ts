/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseTkCategorias, ResponseTkProcesos, ResponseTkSubCategorias } from "../types";

//llamar todas las subcategorias
export const getTkSubCategorias = async (): Promise<ResponseTkSubCategorias> => {
  return await client.get("subcategorias", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear la subcategorias
export const crearTkSubCategoria = async (data: any): Promise<any> => {
  return await client.post<any>("subcategorias", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la subcategorias por id
export const getTkSubCategoria = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`subcategorias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la subcategorias
export const updateTkSubCategoria = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`subcategorias/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la subcategorias 
export const DeleteTkSubCategoria = async ( id: any): Promise<any> => {
  return await client.delete<any>(`subcategorias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todas las categorias padres
export const getTkCategoriasPadres = async (): Promise<ResponseTkCategorias> => {
  return await client.get("categorias-padres", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//llamar todos los procesos
export const getTkProcesosSub = async (): Promise<ResponseTkProcesos> => {
  return await client.get("admin-procesos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Servicio para obtener los usuarios de ese proceso
export const getTkUsuariosProceso = async (
  id: number
): Promise<ResponseTkSubCategorias> => {
  return await client.get<any>(`usuarios-proceso-autoriza/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};