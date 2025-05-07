/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseSearchDispensaciones,
  DispensationSearchData,
  ResponseDispensaciones,
  ResponseDispensacion,
  ResponseEstadosAUD,
  ResponseDespachos,
  EstadosAuditoria,
  IDispensacion,
  ResponseBlob,
} from "../types";

export const getDispensaciones = async (): Promise<ResponseDispensaciones> => {
  return await client.get("dispensaciones", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusDispensacion = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`dispensaciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDispensacion = async (data: any): Promise<any> => {
  return await client.post<any>("dispensaciones", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateDispensacion = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`dispensaciones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const searchDispensaciones = async (
  query: string
): Promise<ResponseSearchDispensaciones> => {
  return await client.get(`dispensaciones-search/${query}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListaDis = async (): Promise<ResponseDispensaciones> => {
  return await client.get<{ data: IDispensacion[]; status: string }>(
    `dispensaciones`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getDispensacionPdf = async (
  dispensacion_id: string
): Promise<any> => {
  return await client.get(`dispensaciones/pdf/${dispensacion_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDispensacionTirillaPdf = async (
  dispensacion_id: string
): Promise<any> => {
  return await client.get(`dispensaciones/tirilla/pdf/${dispensacion_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoDis = async (id: string): Promise<ResponseDispensacion> => {
  return await client.get<{ data: IDispensacion; status: string }>(
    `dispensaciones/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const updateDIS = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`dispensaciones/${id}/update-det`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDisLote = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`dispensaciones/${id}/delete-det`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoDocumento = async (data: any): Promise<any> => {
  return await client.post("dispensaciones/estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const anularDis = async (data: any): Promise<any> => {
  return await client.post("dispensaciones/anular", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDespachos = async (): Promise<ResponseDespachos> => {
  return await client.get("despachos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getEstadosAud = async (): Promise<ResponseEstadosAUD> => {
  return await client.get<{ data: EstadosAuditoria[]; status: string }>(
    `estados-auditoria`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getEstadoDocumento = async (id: any): Promise<any> => {
  return await client.get<any>(`estados-auditoria/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateAuditoria = async (
  data: { idEstado: any; selectedMotivos: any; motivosProducto: any },
  id: any
): Promise<any> => {
  const { idEstado, selectedMotivos, motivosProducto } = data;
  return await client.put<any>(
    `estados-auditoria/${id}`,
    { idEstado, selectedMotivos, motivosProducto },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getArchivosDis = async (id: any): Promise<any> => {
  return await client.get<any>(`listar-archivos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const downloadFile = async (
  file: string,
  consecutivo: string
): Promise<any> => {
  return await client.get<any>(`downloadFile/${file}/${consecutivo}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getLogAuditoria = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`auditoria/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const actualizarEstados = async (
  ids: string[],
  nuevoEstado?: string,
  selectedMot?: string
): Promise<any> => {
  return await client.put<any>(
    "actualizar-estados",
    {
      ids,
      nuevoEstado,
      selectedMot,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const actualizarTodosEstados = async (
  searchData: DispensationSearchData[],
  nuevoEstado: string,
  selectedMot: number
): Promise<ResponseSearchDispensaciones> => {
  return await client.put<any>(
    "actualizar-estados-todos",
    {
      searchData,
      nuevoEstado,
      selectedMot,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getReportAuditoria = async (searchData: any): Promise<any> => {
  return await client.post(`auditoria/reporte/all`, searchData, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getTrazabilidad = async (id: any): Promise<any> => {
  return await client.get<any>(`dis-trazabilidad/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
