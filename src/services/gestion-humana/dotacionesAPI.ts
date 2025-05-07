/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import {
  ResponseDotacion,
  ResponseDotaciones,
  ResponseEntregaDotaciones,
  ResponseEntregaDotacion,
  ResponseDevolucionDotaciones,
  ResponseEmpleadosDotaciones,
  ResponseEmpleadoDotacion,
  ResponseVariableDinamica
} from "../types";

/** dotaciones  */
export const getDotaciones = async (): Promise<ResponseDotaciones> => {
  return await client_gestion.get("dotaciones", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDotacion = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("dotaciones", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDotacion = async (id: React.Key): Promise<ResponseDotacion> => {
  return await client_gestion.get<any>(`dotaciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDotacion = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`dotaciones/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearIngresoDotacion = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("dotaciones/ingresos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const dotacionIngresos = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`dotaciones/ingresos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

/** entregas dotaciones  */

export const getEntregaDotaciones =
  async (): Promise<ResponseEntregaDotaciones> => {
    return await client_gestion.get("entregasdotaciones", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const crearEntregaDotacion = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("entregasdotaciones", data, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const downloadSoporte = async (id: string): Promise<any> => {
  return await client_gestion.get<any>(
    `entregasdotaciones/download-file/${id}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getEntregaDotacion = async (
  id: React.Key
): Promise<ResponseEntregaDotacion> => {
  return await client_gestion.get<any>(`entregasdotaciones/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateEntregaDotacion = async (data: any, id: any): Promise<any> => {
  return await client_gestion.post<any>(`entregasdotaciones/${id}?_method=PUT`, data, {
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

/** Devoluciones dotaciones */

export const crearDevolucionDotacion = async (
  data: any,
  id: any
): Promise<any> => {
  return await client_gestion.post<any>(`devolucionesdotaciones/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getDevolucionesDotaciones =
  async (): Promise<ResponseDevolucionDotaciones> => {
    return await client_gestion.get("devolucionesdotaciones", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const downloadSoporteDevoulucion = async (id: string): Promise<any> => {
  return await client_gestion.get<any>(
    `devolucionesdotaciones/download-file/${id}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

/**
 * Lista de empleados para dotaciones
 */
export const getDotacionesEmpleados =
  async (): Promise<ResponseEmpleadosDotaciones> => {
    return await client_gestion.get("dotaciones-empleados", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getDotacionEmpleado = async (
  id: React.Key
): Promise<ResponseEmpleadoDotacion> => {
  return await client_gestion.get<any>(`dotaciones-empleados/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateDotacionEmpleado = async (data: any, id: any): Promise<any> => {
  return await client_gestion.put<any>(`dotaciones-empleados/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

/**
 * Obtener el salario minimo vigente
 * @param id 
 * @returns 
 */
export const getSalarioMinimo = async (id: number): Promise<any> => {
  return await client_gestion.get<any>(`salariominimo/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};