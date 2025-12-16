/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseRutasPowerBI } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getInformesPowerBi = async (): Promise<ResponseRutasPowerBI> => {
  return await client.get("administrar-rutas-powerBi", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//crear la categoria
export const crearpowerBi = async (data: any): Promise<any> => {
  return await client.post<any>("administrar-rutas-powerBi", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver de la categoria por id
export const getpowerBi = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administrar-rutas-powerBi/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar la categoria
export const updatepowerBi = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`administrar-rutas-powerBi/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteInformePowerBi = async ( id: any): Promise<any> => {
  return await client.delete<any>(`administrar-rutas-powerBi/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};