

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseActivosSubCategoria } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiSubCategorias = async (): Promise<ResponseActivosSubCategoria> => {
  return await client.get("subcategorias-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//crear la categoria
export const crearActiSubCategoria = async (data: any): Promise<any> => {
  return await client.post<any>("subcategorias-activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver de la categoria por id
export const getActiSubCategoria = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`subcategorias-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar la categoria
export const updateActiSubCategoria = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`subcategorias-activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteActiSubCategoria = async ( id: any): Promise<any> => {
  return await client.delete<any>(`subcategorias-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

// Servicio para obtener las subcategorias por categoria padre
export const getActiSubcategoriaID = async (
  id: number
): Promise<ResponseActivosSubCategoria> => {
  return await client.get<any>(`categoria-subcategoria-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};