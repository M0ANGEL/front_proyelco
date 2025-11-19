/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";


//crear el proceos
export const crearProcePro = async (data: any): Promise<any> => {
  return await client.post<any>("procesos-proyectos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver el proceso por id
export const getProcesoProye = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`procesos-proyectos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar la categoria
export const updateProcesoProyec = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`procesos-proyectos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteAmCliente = async ( id: any): Promise<any> => {
  return await client.delete<any>(`admin-clientes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};