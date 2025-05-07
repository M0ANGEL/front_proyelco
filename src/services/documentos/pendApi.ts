/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Convenio,
  IDPendiente,
  IDispensacion,
  ListapreProductos,
  Privilegios,
  ProductoLote,
  ResponseDispensaciones,
  ResponseDocumento,
  ResponseInfoPend,
  ResponseListaPreProductos,
  ResponsePaginatePen,
  ResponsePendientes,
  ResponseProductosLote,
  ResponseSearchConvenios,
} from "../types";

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

export const getListPendientes = async (): Promise<ResponsePendientes> => {
  return await client.get("pendientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPaginatePen = async (
  page = 1,
  estado: string,
  query: string,
  signal: AbortSignal
): Promise<ResponsePaginatePen> => {
  return await client.get<{ data: any; status: string }>(
    `pendientes?page=${page}&estado=${estado}&value=${query}`,
    {
      signal,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearPendiente = async (data: any): Promise<any> => {
  return await client.post<any>("createPendientes", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoPend = async (id: string): Promise<ResponseInfoPend> => {
  return await client.get<{ data: IDPendiente; status: string }>(
    `pendientes/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const updatePEND = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`pendientes/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoPend = async (data: any): Promise<any> => {
  return await client.post("documentos/pend-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchPendConvenio = async (
  query: string
): Promise<ResponseSearchConvenios> => {
  return await client.get<{ data: Convenio[]; status: string }>(
    `getPendConvenio/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPendientePdf = async (pendiente_id: string): Promise<any> => {
  return await client.get(`pendientes/pdf/` + pendiente_id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcelPend = async (): Promise<any> => {
  return await client.get(`pendientes/reporte/pendientes`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getProductosLotes = async (
  data: any
): Promise<ResponseProductosLote> => {
  return await client.post<{ data: ProductoLote[]; status: string }>(
    "dispensaciones-pagos",
    data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getProductosLPConvenio = async (
  lp_id: string
): Promise<ResponseListaPreProductos> => {
  return await client.get<{ status: string; data: ListapreProductos[] }>(
    `pendientes-lp/productos/${lp_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getPagosPendiente = async (
  pendiente_id: React.Key
): Promise<ResponseDispensaciones> => {
  return await client.get<{ status: string; data: IDispensacion[] }>(
    `pendientes/get/pagos/${pendiente_id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("pendientes/delete/item", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const validarExistenciasCodPadre = async (data: any): Promise<ResponseProductosLote> => {
  return await client.post(`pendientes/validar/lotes`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
