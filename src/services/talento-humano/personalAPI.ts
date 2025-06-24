/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponsePersonales } from "../types";

//llamar todo los proveedores
export const getPersonales = async (): Promise<ResponsePersonales> => {
  return await client.get("personal", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear el personal
export const crearPersonal = async (data: any): Promise<any> => {
  return await client.post<any>("personal", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getPersonal = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`personal/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updatePersonal = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`personal/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeletePersonal = async ( id: any): Promise<any> => {
  return await client.delete<any>(`personal/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};