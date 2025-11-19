/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseProyeccion } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProyectosProyeciones = async (): Promise<ResponseProyeccion> => {
  return await client.get("proyectos-proyeccio", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar por id la proyeccion
export const getProyeccionUnica= async (codigo_proyecto: React.Key): Promise<any> => {
  return await client.get<any>(`proyeccionData/${codigo_proyecto}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//envio para crear excel
export const PostgenerarExcelAxuiliarMaterial = async (data: any): Promise<any> => {
  return await client.post<any>("generarExcelAxuiliarMaterial", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};
