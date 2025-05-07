/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseDocumento,
  ResponseListaTRS,
  ResponseInfoTRP,
  ResponseInfoTRS,
  ResponseListaFP,
  Privilegios,
  Traslados,
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

export const crearTRS = async (data: any): Promise<any> => {
  return await client.post<any>("trs", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateTRS = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`trs/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListaTRS = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string,
  signal?: AbortSignal
): Promise<ResponseListaTRS> => {
  return await client.get<{ data: any; status: string }>(
    `trs-getList?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      signal,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getListaTRP = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaTRS> => {
  return await client.get<{ data: any; status: string }>(
    `trp?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getListaTRE = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string
): Promise<ResponseListaTRS> => {
  return await client.get<{ data: any; status: string }>(
    `tre-getList?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoTRP = async (id: string): Promise<ResponseInfoTRP> => {
  return await client.get<{ data: Traslados; status: string }>(
    `trp-show/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoTRE = async (id: string): Promise<ResponseInfoTRP> => {
  return await client.get<{ data: Traslados; status: string }>(`tre/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoTRP = async (data: any): Promise<any> => {
  return await client.post("trp-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearTRE = async (data: any): Promise<any> => {
  return await client.post<any>("tre", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoTRE = async (data: any): Promise<any> => {
  return await client.post("tre-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoTRS = async (id: string): Promise<ResponseInfoTRS> => {
  return await client.get<{ data: Traslados; status: string }>(`trs/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoTRS = async (data: any): Promise<any> => {
  return await client.post("trs-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcelTRP = async (): Promise<any> => {
  return await client.get(`trsalidas/reporte/pendientes`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const updateTrsLote = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`traslados/${id}/delete-det`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTrasladosPdf = async (traslados_id: string): Promise<any> => {
  return await client.get(`trs/pdf/` + traslados_id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTrePdf = async (traslados_id: string): Promise<any> => {
  return await client.get(`tre/pdf/` + traslados_id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTrpPdf = async (traslados_id: string): Promise<any> => {
  return await client.get(`trp/pdf/` + traslados_id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoEstadoTRS = async (id: any): Promise<any> => {
  return await client.get<{ dataEstado: number; status: string }>(
    `info-estado-trs/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getEstadoTRP = async (id: string): Promise<any> => {
  return await client.get<{ dataEstado: number; status: string }>(
    `info-estado-trp/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getActa = async (traslados_id: string): Promise<any> => {
  return await client.get(`tre/acta/${traslados_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getFacturasProveedorDistribucion = async (
  data: any
): Promise<ResponseListaFP> => {
  return await client.post("distribucion/compras/get-facturas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarBodegaDestino = async (
  data: any
): Promise<ResponseListaFP> => {
  return await client.post("trs-cambiar/destino", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
