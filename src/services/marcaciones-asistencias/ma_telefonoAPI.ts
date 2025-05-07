/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_aistencia, client_tk } from "../client";
import {  ResponseMaTelefonos } from "../types";

//llamar todas las categorias
export const getMaTelefonos = async (): Promise<ResponseMaTelefonos> => {
  return await client_aistencia.get("telefonos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};




//crear la categoria
export const crearTkCategoria = async (data: any): Promise<any> => {
  return await client_tk.post<any>("categorias", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getTkCategoria = async (id: React.Key): Promise<any> => {
  return await client_tk.get<any>(`categorias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateTkCategoria = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`categorias/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//inactivar telefono
export const DeleteTelefono = async ( id: any): Promise<any> => {
  return await client_aistencia.delete<any>(`telefonos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//permitir editar serial desde la app 
export const EditSerialApp = async ( id: any): Promise<any> => {
  return await client_aistencia.delete<any>(`telefonos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

