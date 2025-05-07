/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { IvaProducto, ResponseProductoIvas } from "../types";

export const getIvasProducto =
  async (): Promise<ResponseProductoIvas> => {
    return await client.get<{ data: IvaProducto[]; status: string }>(
      "ivas",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

export const setStatusIvaProducto = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`ivas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getIvaProducto = async (id: string): Promise<any> => {
  return await client.get<any>(`ivas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearIvaProducto = async (data: any): Promise<any> => {
  return await client.post<any>("ivas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateIvaProducto = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`ivas/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
