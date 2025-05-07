/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseHorariosAdicionales } from "../types";



//llamar todos los perfiles para asignar horario
export const getPerfilesHorariosAdicional = async (): Promise<ResponseHorariosAdicionales> => {
  return await client.get("horario-adicionales", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



//crear horario adicional
export const CrearPerfilAdicional = async (data: any): Promise<any> => {
  return await client.post<any>(`horario-adicionales`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



//ver perfil por id
export const gethorarioAdicional = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`horario-adicionales/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver perfil por id
  export const updateHorarioAdicional = async (data: any, id: any): Promise<any> => {
    return await client.put<any>(`horario-adicionales/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };
  

//cambiar el estado de el ticket 
 export const cambioEstadoHorariAdicional = async ( id: any): Promise<any> => {
  return await client.delete<any>(`horario-adicionales/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};





