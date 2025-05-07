/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseNotasCreditoGlosaPendientes,
  ResponseListFacturasRadicadas,
  NotaCreditoFVEDisCabecera,
  ResponseListEstadosGlosas,
  ResponseListRadicacionPag,
  ResponseTrazabilidadFVE,
  ResponseListRadicacion,
  ResponseListaOficios,
  FacturaFVECabecera,
  ResponseInfoFveDis,
  TrazabilidadFVE,
  EstadoGlosas,
  Radicacion,
} from "../types";

export const getListadoRadicacion =
  async (): Promise<ResponseListRadicacion> => {
    return await client.get<{
      data: Radicacion[];
      status: string;
    }>("glosas/listar-radicacion", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getListadoRadicacionPag = async (
  data: any
): Promise<ResponseListRadicacionPag> => {
  return await client.post("glosas/listar-radicacion-pag", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getEstadosGlosas =
  async (): Promise<ResponseListEstadosGlosas> => {
    return await client.get<{ data: EstadoGlosas[]; status: string }>(
      "glosas/listar-estados",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

export const getListadoFacturas = async (
  data: any
): Promise<ResponseListFacturasRadicadas> => {
  return await client.post("glosas/listar-facturas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoGlosa = async (data: any): Promise<any> => {
  return await client.post("glosas/cambiar-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTrazabilidad = async (
  id_factura: React.Key
): Promise<ResponseTrazabilidadFVE> => {
  return await client.get<{ data: TrazabilidadFVE[]; status: string }>(
    `glosas/listar-trazabilidad/${id_factura}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const uploadOficios = async (data: any): Promise<any> => {
  return await client.post(`glosas/upload-oficios`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getOficios = async (
  nro_radicado: React.Key
): Promise<ResponseListaOficios> => {
  return await client.get<{ data: string[]; status: string }>(
    `glosas/listar-oficios/${nro_radicado}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadOficio = async (file: string): Promise<any> => {
  return await client.get<any>(
    `glosas/download-file/${encodeURIComponent(btoa(file))}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const deleteOficio = async (file: string): Promise<any> => {
  return await client.get<any>(
    `glosas/delete-file/${encodeURIComponent(btoa(file))}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getFacturaInfo = async (
  id_factura: React.Key
): Promise<ResponseInfoFveDis> => {
  return await client.get<{ data: FacturaFVECabecera; status: string }>(
    `glosas/info-factura/${id_factura}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInformeEstados = async (data: any): Promise<any> => {
  return await client.post(`glosas/generar-informe-estados`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInformeSeguimiento = async (data: any): Promise<any> => {
  return await client.post(`glosas/info-informe-seguimiento`, data, {
    responseType: "blob",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cargarPlano = async (data: any): Promise<any> => {
  return await client.post(`glosas/cargar-plano`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getNotasPendientes = async (
  numero_factura: string
): Promise<ResponseNotasCreditoGlosaPendientes> => {
  return await client.get<{
    data: NotaCreditoFVEDisCabecera[];
    status: string;
  }>(`glosas/notas-pendientes/${numero_factura}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const actualizarDetalle = async (data: any): Promise<any> => {
  return await client.post("glosas/actualizar-detalle", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
