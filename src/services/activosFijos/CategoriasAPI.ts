/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseActivosCategoria } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiCategorias = async (): Promise<ResponseActivosCategoria> => {
  return await client.get("categorias-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear la categoria
export const crearActiCategoria = async (data: any): Promise<any> => {
  return await client.post<any>("categorias-activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getActiCategoria = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`categorias-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateActiCategoria = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`categorias-activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteActiCategoria = async ( id: any): Promise<any> => {
  return await client.delete<any>(`categorias-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};