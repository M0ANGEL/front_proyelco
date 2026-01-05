/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
    ResponseEstadosTickets,
  ResponseTkTickts,
} from "../types";

//llamar tickets abierrtos estados 1
export const getTkGeneradoAbiertos =
  async (): Promise<ResponseTkTickts> => {
    return await client.get("tickets-generados-abiertos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getTkGeneradoCerrado = async (
    id: number
  ): Promise<ResponseEstadosTickets> => {
    return await client.get<any>(`tickets-generados-cerrados/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getTkGeneradoCalificados = async (
    id: number
  ): Promise<ResponseEstadosTickets> => {
    return await client.get<any>(`tickets-generados-calificados/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getTkGeneradoRechazados = async (
    id: number
  ): Promise<ResponseEstadosTickets> => {
    return await client.get<any>(`tickets-generados-rechazados/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };
  
  


