/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseProyectos } from "../types";


//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getGestionProyecto = async (): Promise<ResponseProyectos> => {
  return await client.get("gestion-proyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//crear el proceos
export const crearProcePro = async (data: any): Promise<any> => {
  return await client.post<any>("procesos-proyectos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



//ver el proceso por id
export const getProcesoProye = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`procesos-proyectos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la categoria
export const updateProcesoProyec = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`procesos-proyectos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//Iniciar Proyecto 
export const IniciarProyecto = async ( id: any): Promise<any> => {
  return await client.delete<any>(`gestion-proyectos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//detalle del proyecto
export const getProyectoDetalleGestion = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`gestion-proyectos-detalle/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//detalle del proyecto
export const habilitarTorre = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`gestio-habilitar-torre/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const IniciarTorre = async (data: any): Promise<any> => {
  return await client.post<any>("gestion-iniciar-torre", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//detalle del proyecto
export const InfoProyecto = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`info-proyecto/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//confirmar apartamento 
export const confirmarAptGestion = async ( id: any): Promise<any> => {
  return await client.get<any>(`gestion-confirmar-apartamento/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//confirmar apartamento 
export const confirmarValidacionApt = async ( data: any): Promise<any> => {
  return await client.post<any>(`gestion-confirmar-validar`, data,{
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//confirmar pisos por dia 
export const confirmarPisosXDia = async ( data: any): Promise<any> => {
  return await client.post<any>(`activacionXdia`, data,{
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//full detalle del proyecto
export const Proyectodetallado = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`InformeDetalladoProyectos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//anulacion de apt(cambio de estado a 0 con detalle)
export const cambioestadoAptAnulacion = async (data: any): Promise<any> => {
  return await client.post<any>("CambioEstadosApt-anulacion", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};




