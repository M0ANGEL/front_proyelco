/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseProcesosProyectos } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProcesosProyecto = async (): Promise<ResponseProcesosProyectos> => {
  return await client.get("procesos-proyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear la categoria
export const crearAmCliente = async (data: any): Promise<any> => {
  return await client.post<any>("admin-clientes", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getAmcliente = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`admin-clientes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateAmCliente = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`admin-clientes/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteAmCliente = async ( id: any): Promise<any> => {
  return await client.delete<any>(`admin-clientes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};