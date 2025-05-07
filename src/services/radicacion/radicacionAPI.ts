/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ListRadicacion,
  Radicacion,
  ResponseInfoRadicacion,
  ResponseSearchRadicacion,
} from "../types";

// consultar la lista de proveedores
export const getListaRadicacion = async (
  data: any
): Promise<ResponseSearchRadicacion> => {
  return await client.post<{ data: ListRadicacion[]; status: string }>(
    `/listar-radicados`,
    data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const radicacion = async (data: any): Promise<any> => {
  return await client.post<any>(`/radicar`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getRadicacionInfo = async (
  id: React.Key
): Promise<ResponseInfoRadicacion> => {
  return await client.get<{ data: Radicacion; status: string }>(
    `radicar/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const cargarPlanoRadicacion = async (data: any): Promise<any> => {
  return await client.post(`radicacion/cargar-plano`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const radicarMasivo = async (data: any): Promise<any> => {
  return await client.post(`radicar-masivo`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getClientesRadicaciones = async (): Promise<any> => {
  return await client.get(`radicar-get-clientes`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}
