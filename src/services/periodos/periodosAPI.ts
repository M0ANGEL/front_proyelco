import { client } from "../client";

export const setStatusPaciente = async (id: React.Key): Promise<any> => {
    return await client.delete<any>(`pacientes/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const createPeriodos = async (data: any): Promise<any> => {
    return await client.post<any>('periodos', data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getResumenMes = async (): Promise<any> => {
    return await client.get("periodos-resumenPorMes", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getHistorico = async (): Promise<any> => {
    return await client.get("periodos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };