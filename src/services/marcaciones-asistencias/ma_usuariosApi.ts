/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_aistencia, client_tk } from "../client";
import {   ResponseUsuarioRegistrados } from "../types";

//llamar todos los usuaiors
export const getMaUsuarios= async (): Promise<ResponseUsuarioRegistrados> => {
  return await client_aistencia.get("ma-personal", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//ver de la categoria por id
export const getTkCategoria = async (id: React.Key): Promise<any> => {
  return await client_tk.get<any>(`categorias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//inactivar telefono
export const DeleteTelefono = async ( id: any): Promise<any> => {
  return await client_aistencia.delete<any>(`telefonos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


