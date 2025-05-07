/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { GrupoProducto, ResponseProductoGrupos } from "../types";

export const getGruposProducto =
  async (): Promise<ResponseProductoGrupos> => {
    return await client.get<{ data: GrupoProducto[]; status: string }>(
      "gruposproducto",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

export const setStatusGrupoProducto = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`gruposproducto/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getGrupoProducto = async (id: string): Promise<any> => {
  return await client.get<any>(`gruposproducto/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearGrupoProducto = async (data: any): Promise<any> => {
  return await client.post<any>("gruposproducto", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateGrupoProducto = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`gruposproducto/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
