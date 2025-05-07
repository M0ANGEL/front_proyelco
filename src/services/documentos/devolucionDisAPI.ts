/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  DevolucionDispensacionCabecera,
  IDispensacion,
  Paciente,
  Privilegios,
  ResponseDISxPACIENTE,
  ResponseDocumento,
  ResponseInfoDevolucion,
  ResponseListaDevolucion,
  ResponseSearchPacientes,
} from "../types";

export const getListaDevolucion = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string,
  tipo_documento_id?: string,
  signal?: AbortSignal
): Promise<ResponseListaDevolucion> => {
  return await client.get<{ data: any; status: string }>(
    `documentos/dvd?page=${page}&bodega_id=${bodega_id}&tipo_documento_id=${tipo_documento_id}&estado=${estado}&value=${query}`,
    {
      signal,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoDevolucion = async (id: string): Promise<ResponseInfoDevolucion> => {
  return await client.get<{
    data: DevolucionDispensacionCabecera;
    status: string;
  }>(`documentos/dvd/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDevolucion = async (data: any): Promise<any> => {
  return await client.post<any>("documentos/dvd", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoDevolucion = async (data: any): Promise<any> => {
  return await client.post("documentos/dvd-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchPacientes = async (
  query: string,
): Promise<ResponseSearchPacientes> => {
  return await client.get<{ data: Paciente; status: string }>(
    `pacientes-search-dvd/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getDISxPACIENTE = async (
  codigo_documento: string,
  bodega_id: string,
  paciente_id = 'NA',
): Promise<ResponseDISxPACIENTE> => {
  return await client.get<{ data: IDispensacion[]; status: string }>(
    `documentos/dvd/dis-x-pac/${codigo_documento}/${bodega_id}/${paciente_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPDF = async (dvh_id: string): Promise<any> => {
  return await client.get(`documentos/dvd-pdf/${dvh_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const validarAccesoDocumento = async (
  codigo_documento: string,
  id_empresa: string
): Promise<ResponseDocumento> => {
  const data = {
    codigo_documento,
    id_empresa,
  };
  return await client.post<{ data: Privilegios; status: string }>(
    "validar-documento",
    data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
