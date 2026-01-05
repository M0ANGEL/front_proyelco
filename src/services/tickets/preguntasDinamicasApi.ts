/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseTkPPreguntasDinamicas } from "../types";

//llamar todos las procesos
export const getTkPreguntasDinamicas = async (): Promise<ResponseTkPPreguntasDinamicas> => {
  return await client.get("preguntas-dinamicas-tk", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear el proceso
export const crearPreguntaDinamica = async (data: any): Promise<any> => {
  return await client.post<any>("preguntas-dinamicas-tk", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver el proceso por id
export const getPreguntaDinamica = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`preguntas-dinamicas-tk/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar el proceso
export const updatePreguntasDinamicas = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`preguntas-dinamicas-tk/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//inactivar pregunta dinamica
export const deletePreguntasDinamica = async ( id: any): Promise<any> => {
    return await client.delete<any>(`preguntas-dinamicas-tk/${id}`,  {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };
