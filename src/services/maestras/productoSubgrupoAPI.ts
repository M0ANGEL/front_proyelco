/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseProductoSubGrupos,
  SubGrupoProducto,
} from "../types";

export const getSubGruposProducto =
  async (): Promise<ResponseProductoSubGrupos> => {
    return await client.get<{ data: SubGrupoProducto[]; status: string }>(
      "subgruposproducto",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

export const setStatusSubGrupoProducto = async (
  id: React.Key
): Promise<any> => {
  return await client.delete<any>(`subgruposproducto/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getSubGrupoProducto = async (id: string): Promise<any> => {
  return await client.get<any>(`subgruposproducto/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearSubGrupoProducto = async (data: any): Promise<any> => {
  return await client.post<any>("subgruposproducto", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateSubGrupoProducto = async (
  data: any,
  id: any
): Promise<any> => {
  return await client.put<any>(`subgruposproducto/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
