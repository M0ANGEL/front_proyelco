/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseAsistencia, ResponsePersonales, ResponseProyectos } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todo los asistencia
export const getAsistencias = async (): Promise<ResponseAsistencia> => {
  return await client.get("asistencias", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//crear el asistencias
export const crearAsistencias = async (data: any): Promise<any> => {
  return await client.post<any>("asistencias", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver de la asistencias por id
export const getAsistencia = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`asistencias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar la asistencias
export const updateAsistencia = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`asistencias/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cambiar el estado de la asistencias 
export const DeleteAsistencia = async ( id: any): Promise<any> => {
  return await client.delete<any>(`asistencia/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar todos los proyectos activos
export const getTkProyectos = async (): Promise<ResponseProyectos> => {
  return await client.get("proyectos-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar todos los empleados
export const getTkEmpleados = async (): Promise<ResponsePersonales> => {
  return await client.get("empleados", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};