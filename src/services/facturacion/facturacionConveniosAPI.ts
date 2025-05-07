/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ConveniosFacturacion,
  ResponseListFacturacionConvenios,
  ResponseSearchConveniosFacturacion,
  ResponseSearchUsuariosFacturacion,
} from "../types";

export const getListaUsuariosConvenios =
  async (): Promise<ResponseListFacturacionConvenios> => {
    return await client.get("facturacion/convenios", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getConveniosFacturacion =
  async (): Promise<ResponseSearchConveniosFacturacion> => {
    return await client.get("facturacion/listar-convenios", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getUsuariosFacturacion =
  async (): Promise<ResponseSearchUsuariosFacturacion> => {
    return await client.get("facturacion/listar-usuarios", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getConvenio = async (
  id: string
): Promise<{ data: { status: string; data: ConveniosFacturacion } }> => {
  return await client.get<{ status: string; data: ConveniosFacturacion }>(
    `facturacion/convenios/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const updateConvenioFacturacion = async (
  data: any,
  id: any
): Promise<any> => {
  return await client.put<any>(`facturacion/convenios/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearConvenioFacturacion = async (data: any): Promise<any> => {
  return await client.post<any>("facturacion/convenios", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getConvenios = async (): Promise<any> => {
  return await client.get<{ data: any; status: string }>(
    "facturacion/listar-convenios",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getUsers = async (): Promise<any> => {
  return await client.get<{ data: any; status: string }>(
    "facturacion/listar-usuarios",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
