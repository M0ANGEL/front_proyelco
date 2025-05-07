/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ProductoPadre, ResponseProductosPadre } from "../types";

export const getProductosPadre = async (): Promise<ResponseProductosPadre> => {
  return await client.get<{ data: ProductoPadre[]; status: string }>(
    `productos-padre`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getProductoPadre = async (
  id: string
): Promise<{ data: { status: string; data: ProductoPadre } }> => {
  return await client.get<{ status: string; data: ProductoPadre }>(
    `productos-padre/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearProductoPadre = async (data: any): Promise<any> => {
  return await client.post<any>("productos-padre", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateProductoPadre = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`productos-padre/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const buscarPadre = async (
  query: string
): Promise<ResponseProductosPadre> => {
  return await client.get<{ data: ProductoPadre[]; status: string }>(
    `buscar-padre/${encodeURIComponent(btoa(query))}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const validarPadre = async (
  query: string
): Promise<ResponseProductosPadre> => {
  return await client.get<{ data: ProductoPadre[]; status: string }>(
    `validar-padre/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const removeCodigoPadre = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`productos-padre/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
