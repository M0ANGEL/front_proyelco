/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponsePerfilesHorarios } from "../types";


//llamar todos los perfiles para asignar horario
export const getPerfilesHorariosAll = async (): Promise<ResponsePerfilesHorarios> => {
  return await client.get("crear-horarios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//llamar todos los perfiles para asignar horario
export const getPerfilesHorarios = async (): Promise<ResponsePerfilesHorarios> => {
  return await client.get("perfiles-horarios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//crear perfil para los horarios
export const CrearPerfil = async (data: any): Promise<any> => {
  return await client.post<any>(`crear-perfiles-horarios`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


// Crear horario
export const crearHorarios = async (data: any): Promise<any> => {
  try {
    const response = await client.post<any>("crear-horarios", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return response.data; // Devuelve solo los datos relevantes
  } catch (error: any) {
    console.error("Error al crear horarios:", error.response?.data || error.message);
    throw error; // Propaga el error para manejarlo en el frontend
  }
};


//ver perfil por id
export const getPerfilHorario = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`crear-horarios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



//cambiar el estado de el ticket 
export const cambioEstado = async (id: any): Promise<any> => {
  return await client.delete<any>(`crear-horarios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actializar el horario
export const updateHorario = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`crear-horarios/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//activar horario
export const ActivarAutorizacion = async ( id: any): Promise<any> => {
  return await client.get<any>(`cancelar-rechazo-autorizacion/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}; 
