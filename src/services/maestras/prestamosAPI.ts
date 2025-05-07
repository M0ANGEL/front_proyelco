/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { Paciente, ResponsePaciente, ResponsePacientes, ResponseSearchPacientes, ResponseSearchTerceros, Tercero } from "../types";

export const getPacientes = async (): Promise<ResponsePacientes> => {
  return await client.get("pacientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusPaciente = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`pacientes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPaciente = async (id: string): Promise<ResponsePaciente> => {
  return await client.get<{ data: Paciente; status: string }>(`pacientes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearPaciente = async (data: any): Promise<any> => {
  return await client.post<any>("pacientes", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updatePaciente = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`pacientes/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const searchPacientes = async (
  query: string
): Promise<ResponseSearchPacientes> => {
  return await client.get<{ data: Paciente; status: string }>(
    `pacientes-search/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const anyTerceros = async (
  query: string
): Promise<ResponseSearchTerceros> => {
  return await client.get<{ data: Tercero[]; status: string }>(
    `terceros-type/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const searchTercero = async (
  query: string
): Promise<ResponseSearchTerceros> => {
  return await client.get<{ data: Tercero[]; status: string }>(
    `getTercero/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};