/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseBodegas_areas } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiBodegas = async (): Promise<ResponseBodegas_areas> => {
  return await client.get("bodega-areas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear la categoria
export const crearActiBodega = async (data: any): Promise<any> => {
  return await client.post<any>("bodega-areas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getActiBodega= async (id: React.Key): Promise<any> => {
  return await client.get<any>(`bodega-areas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateActiBodega = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`bodega-areas/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteActiBodegas = async ( id: any): Promise<any> => {
  return await client.delete<any>(`bodega-areas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};