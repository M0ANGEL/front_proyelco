/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseListTipoDispensacion,
  ResponseInfoTipoDispensacion,
  ResponseListCamposDispensacion,
} from "../types";

export const getTiposDispensaciones =
  async (): Promise<ResponseListTipoDispensacion> => {
    return await client.get("tipos_dispensaciones", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const crearTipoDispensacion = async (data: any): Promise<any> => {
  return await client.post<any>("tipos_dispensaciones", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTipoDispensacion = async (
  id: string
): Promise<ResponseInfoTipoDispensacion> => {
  return await client.get(`tipos_dispensaciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateTipoDispensacion = async (
  data: any,
  id: any
): Promise<any> => {
  return await client.put<any>(`tipos_dispensaciones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getCampos = async (): Promise<ResponseListCamposDispensacion> => {
  return await client.get("campos_dispensacion", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
