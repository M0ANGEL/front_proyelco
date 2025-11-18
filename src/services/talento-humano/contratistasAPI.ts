/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseContratistasSST } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todo los proveedores
export const getContratistas = async (): Promise<ResponseContratistasSST> => {
  return await client.get("administar-contratistas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};



//crear la categoria
export const crearContratista = async (data: any): Promise<any> => {
  return await client.post<any>("administar-contratistas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver de la categoria por id
export const getContratista= async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administar-contratistas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar la categoria
export const updateContratista = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`administar-contratistas/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteContratista = async ( id: any): Promise<any> => {
  return await client.delete<any>(`administar-contratistas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

