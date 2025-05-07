/* eslint-disable @typescript-eslint/no-explicit-any */
import { client, client_rep, client_gestion } from "../client";

import {
  Convenio,
  ResponseConsultaPendientesPaciente,
  ResponseSearchConvenios,
} from "../types";

export const generarReporteDispensacion = async (data: any): Promise<any> => {
  return await client.post("reportes/dispensacion", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const generarReporteCompras = async (data: any): Promise<any> => {
  return await client.post("reportes/compras", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const generarReporteOtrosDocumentos = async (
  data: any
): Promise<any> => {
  return await client.post("reportes/otros-documentos", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const generarReporteTraslados = async (data: any): Promise<any> => {
  return await client.post("reportes/traslados", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const generarReporteFacturacion = async (data: any): Promise<any> => {
  return await client.post("reportes/facturacion", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const getConveniosRep = async (): Promise<ResponseSearchConvenios> => {
  return await client.get<{ data: Convenio[]; status: string }>(
    "reportes/getConvenios",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadRipsFile = async (path: string): Promise<any> => {
  return await client.get<any>(
    `downloadRipsFile/${encodeURIComponent(btoa(path))}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const generarInformeCorteInventario = async (
  data: any
): Promise<any> => {
  return await client.post("inventarios/informe-corte", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const generarInformePHPPuro = async (
  data: any,
  archivo: string
): Promise<any> => {
  return await client_rep.post(archivo + ".php", data);
};

export const getEntregaPacientes = async (data: any): Promise<any> => {
  return await client.post<any>("pacientes-entrega", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const generarReporteEmpleados = async (data: any): Promise<any> => {
  return await client_gestion.post("reportes/empleados", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const generarReporteIncapacidades = async (data: any): Promise<any> => {
  return await client_gestion.post("reportes/incapacidades", data, {
    // responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
};

export const getPendientesPacientes = async (
  data: any
): Promise<ResponseConsultaPendientesPaciente> => {
  return await client.post<any>("paciente-pendientes", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const generarReporteRetiros = async (data: any): Promise<any> => {
  return await client_gestion.post("reportes/retiros", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
};

export const generarReporteEntregaDotacion = async (data: any): Promise<any> => {
  return await client_gestion.post("reportes/entreaga/dotacion", data, {
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const generarRetiroCesantias = async (data: any): Promise<any> => {
  return await client_gestion.post("reportes/retiroscesantias", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
};