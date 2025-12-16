/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseTkCategorias } from "../types";

//llamar todas las categorias
export const getTkCategorias = async (): Promise<ResponseTkCategorias> => {
  return await client.get("categorias", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear la categoria
export const crearTkCategoria = async (data: any): Promise<any> => {
  return await client.post<any>("categorias", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getTkCategoria = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`categorias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateTkCategoria = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`categorias/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteTkCategoria = async ( id: any): Promise<any> => {
  return await client.delete<any>(`categorias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};