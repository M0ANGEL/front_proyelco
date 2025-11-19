/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseAmClientes, ResponseTipoProyectos } from "@/types/typesGlobal";
import { client } from "../client";



//llamado de los tipos de proyectos 
export const getTipoProyectos = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`tipo-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//llamado de los tipos de procesos 
export const getProcesosProyectos = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`procesos-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamado de los tipos de proyectos 
export const getValidacionesProcesos = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`validacion-procesos-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//llamada de los cleintes
export const getCLientesNIT= async (): Promise<ResponseAmClientes> => {
  return await client.get("admin-clientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamado de usuarios para proyecto
export const getUsersProyecto = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`usuarios-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamado de los ingenieros de obras
export const getIngenieros = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`ingenieros-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};



//llamado de los usuarios para notificacion de porcentajes de obras
export const getUsuariosCorreo = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`usuario-correos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};










