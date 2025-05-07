/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  DistribucionCabecera,
  ResponseDistribucionListado,
  ResponseDistribucionList,
  ResponseDistribucion,
  ResponseAlertasDistribucion,
  ResponseDistribucionFactura,
  ResponseGenerarTraslados,
} from "../types";

export const getListadoDistribucion = async (
  data: any
): Promise<ResponseDistribucionList> => {
  return await client.post("distribucion/compras/lista", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListadoDistComprasSelect =
  async (): Promise<ResponseDistribucionListado> => {
    return await client.get<{
      data: DistribucionCabecera[];
      status: string;
    }>("distribucion/compras/lista/select", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const setStatusDistribucion = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`distribucion/compras/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPlantillaDistribucion = async (data: any): Promise<any> => {
  return await client.post(`distribucion/compras/get-plantilla`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDistribucion = async (
  id: string
): Promise<ResponseDistribucion> => {
  return await client.get<{
    data: DistribucionCabecera;
    status: string;
  }>(`distribucion/compras/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDistribucion = async (data: any): Promise<any> => {
  return await client.post<any>("distribucion/compras", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDistribucion = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`distribucion/compras/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getAlertasDistCompras = async (
  data: any
): Promise<ResponseAlertasDistribucion> => {
  return await client.post(`distribucion/compras/get-alertas`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDistribucionFP = async (
  data: any
): Promise<ResponseDistribucionFactura> => {
  return await client.post(`distribucion/compras/get-distribucion-fp`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const generarTraslados = async (
  data: any
): Promise<ResponseGenerarTraslados> => {
  return await client.post(`distribucion/compras/generar-traslados`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInformeDistribucion = async (
  distribucion_id: string
): Promise<any> => {
  return await client.get(
    `distribucion/compras/generar-informe/${distribucion_id}`,
    {
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
export const getInformeCumplimiento = async (
  distribucion_id: string
): Promise<any> => {
  return await client.get(
    `distribucion/compras/generar-informe-cumplimiento/${distribucion_id}`,
    {
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
