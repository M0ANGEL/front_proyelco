/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_tk } from "../client";
import {
  ResponseEstadosTickets,
  ResponseTkCalificaciones,
  ResponseTkPerfilModerador,
  ResponseTkTickts,
  ResponseTkUsers,
} from "../types";

//llamar tickets 1 - 2
export const getTkTicketAdministracion =
  async (): Promise<ResponseTkTickts> => {
    return await client_tk.get("ticket-administracion", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };


//llamar tickets 1 - 2
export const getTkTicketAdministracionGestion =
  async (): Promise<ResponseTkTickts> => {
    return await client_tk.get("gestion-tickets-administracion", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };



//tickets por estaos
export const getTkTicketEstados = async (
  id: number
): Promise<ResponseEstadosTickets> => {
  return await client_tk.get<any>(`estados-tickets/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//tickets por estaos gestion
export const getTkTicketEstadosgestion = async (
  id: number
): Promise<ResponseEstadosTickets> => {
  return await client_tk.get<any>(`estados-tickets-gestion/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



export const getTkTicketEstadosId = async (id: React.Key): Promise<any> => {
  return await client_tk.get<any>(`estados-tickets-id/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//buscar las calificaiones amarradas a ese tickets
export const getTkTicketPreguntasSe = async (
  id: number
): Promise<ResponseTkCalificaciones> => {
  return await client_tk.get<any>(`estados-tickets-calificaiones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//ver de el ticket que necesita autorizar por id
export const getTkTicketAdminin = async (id: React.Key): Promise<any> => {
  return await client_tk.get<any>(`ticket-administracion/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de el ticket
export const GestionarTkTicket = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`gestionar-ticket/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de el ticket
export const CerrarTkTicket = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`cerrar-ticket/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//cambiar el estado de el ticket
export const RechazoTkTicket = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`rechazar-ticket/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//rechazar la gestion del ticket
export const RechazoGestionTkTicket = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`rechazar-gestion-ticket/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//descargar de documento amarrado al ticket
export const DocumentoTkTicket = async (id: any) => {
  return await client_tk.get(`/documento-ticket-descarga/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    responseType: "blob", // Asegura que la respuesta sea tratada como un archivo binario
  });
};

//asiganar  el ticket
export const AsignarTkTicket = async (data: any): Promise<any> => {
  return await client_tk.post<any>("asignacion-users-ticket", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todos los usuarios
export const getTkUsers = async (): Promise<ResponseTkUsers> => {
  return await client_tk.get("asignacion-users", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//hisotrial | Trazabilidadticket
export const getTrazabilidadTicket = async (id: React.Key): Promise<any> => {
  return await client_tk.get<any>(`historial-gestion-ticket/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//moderador ticket
export const getTkmoderadorPerfil =
  async (): Promise<ResponseTkPerfilModerador> => {
    return await client_tk.get("perfil-moderador-tickets", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

//envio de observacion de el ticket
export const observacionTkTicket = async (data: any, id: any): Promise<any> => {
  return await client_tk.put<any>(`observacion-tickets/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
 

//entrar en estad de validacion y salir de ese estado
export const estadoValidacion = async (id: React.Key): Promise<any> => {
  return await client_tk.get<any>(`ticket-estado-validacion/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};