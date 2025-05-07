/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_tk } from "../client";
import {
  ResponseEstadosTickets,
  ResponseTkCategorias,
  ResponseTkPreguntas,
  ResponseTkProcesos,
  ResponseTkSubCategorias,
  ResponseTkTickts,
  ResponseTkUsers,
} from "../types";

//llamar todos los tickets
export const getTkTickets = async (): Promise<ResponseTkTickts> => {
  return await client_tk.get("tickets", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//crear el ticket
export const crearTkTicket = async (data: FormData): Promise<any> => {
  return await client_tk.post<any>("tickets", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

//ver de el ticket por id
export const getTkTicket = async (id: React.Key): Promise<any> => {
  return await client_tk.get<any>(`tickets/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//actualizar la ticket
export const updateTkTicket = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`tickets/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de el ticket
export const AnularTkTicket = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`anular-ticket/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todas las categorias padres
export const getTkCategoriasPadresTicket = async (
  id: number
): Promise<ResponseTkCategorias> => {
  return await client_tk.get(`sub-categorias-padres/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Servicio para obtener las subcategorias por categoria padre
export const getTkTicketSubCategoria = async (
  id: number
): Promise<ResponseTkSubCategorias> => {
  return await client_tk.get<any>(`TkTicketsubcategorias/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//servicio para traer las preguntas del ticket jejej
export const getTkTicketPreguntas = async (
  id: number
): Promise<ResponseTkPreguntas> => {
  return await client_tk.get<any>(`calificar-ticket/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//calificar
export const crearTkTicketCalificacion = async (data: any): Promise<any> => {
  return await client_tk.post<any>("calificar-ticket", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//historial de tickets
export const getTkTicketsHistorial =
  async (): Promise<ResponseEstadosTickets> => {
    return await client_tk.get("tickets-user-historial", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

//no conformidad con la gestion del ticket
//cambiar el estado de el ticket
export const NoConfermeGestio = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`inconformidad-gestio-ticket/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todos las procesos que tengan mesa
export const getTkProcesosTicket = async (): Promise<ResponseTkProcesos> => {
  return await client_tk.get("procesos-crear-ticker", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//editar ticket si tiene observacion
export const editarTicketObservacion = async (
  id: number,
  data: FormData
): Promise<any> => {
  return await client_tk.post<any>(`editar-ticket/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

//preguntas dinamicas
export const getTkPreguntasDinamicas = async (
  id: number
): Promise<ResponseTkCategorias> => {
  return await client_tk.get(`preguntas-dinamicas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Servicio para obtener las subcategorias por categoria padre
export const getTkFarmacias = async (): Promise<ResponseTkProcesos> => {
  return await client_tk.get("tickets-crear-farmacia", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//usuarios de farmacia
export const getTkFarmaciaUsuarios = async (
  id: number
): Promise<ResponseTkUsers> => {
  return await client_tk.get<any>(`tickets-crear-farmacia-usuarios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
