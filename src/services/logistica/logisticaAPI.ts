/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseBodegas_areas } from "@/types/typesGlobal";
import { client_sinco } from "../client";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProyectosSinco = async (): Promise<ResponseBodegas_areas> => {
  return await client_sinco.get("solicitudes-proyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//crear la categoria
export const getSolicitudesPorProyecto = async (data: any): Promise<any> => {
  return await client_sinco.post<any>("solicitudes-agrupadas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//generar pdf
//crear la categoria
export const getSolicitudesPorProyectoPDF = async (data: any): Promise<any> => {
  return await client_sinco.post<any>("solicitudes-proyectos-pdf", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};