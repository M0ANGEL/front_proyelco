/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseProcesosProyectos } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProcesosProyecto = async (): Promise<ResponseProcesosProyectos> => {
  return await client.get("procesos-proyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todas los proyectos get
export const getProyectos = async (): Promise<ResponseProcesosProyectos> => {
  return await client.get("administracion-proyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//crear la categoria
export const crearProyecto = async (data: any): Promise<any> => {
  return await client.post<any>("administracion-proyectos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la categoria por id
export const getProyectoID = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administracion-proyectos/${id}`, {
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
export const DeleteProyecto = async ( id: any): Promise<any> => {
  return await client.delete<any>(`administracion-proyectos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};