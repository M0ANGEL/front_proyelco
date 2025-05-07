/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Eps,
  Paciente,
  ResponsePaciente,
  ResponsePacientes,
  ResponsePacientesPag,
  ResponseSearchEps,
  ResponseSearchPacientes,
} from "../types";

export const getPacientes = async (): Promise<ResponsePacientes> => {
  return await client.get<{ status: string; data: Paciente[] }>("pacientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPacientesPag = async (
  page = 1,
  query?: string,
  signal?: AbortSignal
): Promise<ResponsePacientesPag> => {
  return await client.get<{ data: any; status: string }>(
    `pacientes-paginate?page=${page}&value=${query}`,
    {
      signal,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const setStatusPaciente = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`pacientes/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPaciente = async (id: string): Promise<ResponsePaciente> => {
  return await client.get<{ data: Paciente; status: string }>(
    `pacientes/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
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
  query: string,
  tipo_documento: string
): Promise<ResponseSearchPacientes> => {
  return await client.get<{
    data: Paciente;
    pendiente: Paciente;
    alerta_autorizacion_redladera: boolean;
    status: string;
  }>(`pacientes-search/${query}/${tipo_documento}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const anyPacientes = async (
  query: string
): Promise<ResponseSearchPacientes> => {
  return await client.get<{
    data: Paciente;
    status: string;
    pendiente: Paciente;
    alerta_autorizacion_redladera: boolean;
  }>(`pacientes-type/${query}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchEps = async (query: string): Promise<ResponseSearchEps> => {
  return await client.get<{ data: Eps[]; status: string }>(
    `eps-search?value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getCoincidenciasNumeroId = async (
  query: string
): Promise<ResponsePacientes> => {
  return await client.get<{ data: Paciente[]; status: string }>(
    `pacientes-coincidencias/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
