/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseProveedores } from "../types";

//llamar todo los proveedores
export const getProveedores = async (): Promise<ResponseProveedores> => {
  return await client.get("proveedores", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear el proveedores
export const crearProveedor = async (data: any): Promise<any> => {
  return await client.post<any>("proveedores", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getProveedore = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`proveedores/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateProvedor = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`proveedores/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteProveedor = async ( id: any): Promise<any> => {
  return await client.delete<any>(`proveedores/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};