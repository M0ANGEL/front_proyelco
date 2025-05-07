/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Bodega,
  ResponseBodega,
  ResponseBodegas,
  ResponseBodxusu,
} from "../types";

export const getBodegas = async (): Promise<ResponseBodegas> => {
  return await client.get<{ data: Bodega[]; status: string }>("bodegas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const getBodegasSebthi = async (): Promise<ResponseBodegas> => {
  return await client.get<{ data: Bodega[]; status: string }>("bodegas-sebthi", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusBodega = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`bodegas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusInventarioBodega = async (
  id: React.Key
): Promise<any> => {
  return await client.delete(`bodegas-inventario/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getBodega = async (id: string): Promise<ResponseBodega> => {
  return await client.get<{ data: Bodega; status: string }>(`bodegas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearBodega = async (data: any): Promise<any> => {
  return await client.post<any>("bodegas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const changeEstadoInventario = async (data: any): Promise<any> => {
  return await client.post("bodegas-inventario", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateBodega = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`bodegas/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getBodDestino = async (id: string): Promise<ResponseBodega> => {
  return await client.get<{ data: Bodega; status: string }>(
    `bod-destino/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getBodxusu = async (): Promise<ResponseBodxusu[]> => {
  return await client.get(`bodxusu`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getBodegasLotes = async (
  withLotes: boolean
): Promise<ResponseBodegas> => {
  return await client.get<{ data: Bodega[]; status: string }>(
    `bodegas-items?with_items=${withLotes}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getBodxusuxaud = async (): Promise<ResponseBodxusu[]> => {
  return await client.get(`bodxusuxaud`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
