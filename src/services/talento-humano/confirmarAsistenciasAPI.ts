/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseAsistencia, ResponsePersonales, ResponseProyectos } from "../types";

//llamar todo los asistencia
export const getAsistenciasConfirmar = async (): Promise<ResponseAsistencia> => {
  return await client.get("asistencias-confirmar", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear el asistencias
export const crearAsistencias = async (data: any): Promise<any> => {
  return await client.post<any>("asistencias", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de la asistencias por id
export const getAsistencia = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`asistencias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la asistencias
export const updateAsistencia = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`asistencias/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de la asistencias 
export const DeleteAsistencia = async ( id: any): Promise<any> => {
  return await client.delete<any>(`asistencia/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todos los proyectos activos
export const getTkProyectos = async (): Promise<ResponseProyectos> => {
  return await client.get("proyectos-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todos los empleados
export const getTkEmpleados = async (): Promise<ResponsePersonales> => {
  return await client.get("empleados", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//confirmar asistencia
export const confirmarAsistencia = async (data: any): Promise<any> => {
  return await client.post<any>("asistencias-confirmar-empleado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//confirmar no asistencia
export const confirmarNoAsistencia = async (data: any): Promise<any> => {
  return await client.post<any>("no-asistencias-empleado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};