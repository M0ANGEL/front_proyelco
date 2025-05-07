/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseIncapacidad } from "../types";

export const getIncapacidades = async (): Promise<ResponseIncapacidad> => {
  return await client_gestion.get("incapacidades", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearIncapacidad = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("incapacidades", data, {
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data", 
    },
  });
};

export const getIncapacidad = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`incapacidades/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateIncapacidad = async (data: any, id: any): Promise<any> => {
  return await client_gestion.post<any>(`incapacidades/${id}`, data, {
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data", 
    },
  });
};

export const getDiasIncapacidadEmpleado = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`incapacidades/empleado/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getIncapacidadesEstadisticas = async (): Promise<ResponseIncapacidad> => {
  return await client_gestion.get("incapacida/estadisticas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getIncapacidadesSinRadicar = async (): Promise<ResponseIncapacidad> => {
  return await client_gestion.get("incapacidadesSinRadicar", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getIncapacidadesSinPagar = async (): Promise<ResponseIncapacidad> => {
  return await client_gestion.get("incapacidadesSinPagar", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getSoportesIncapacidades = async (id: string): Promise<any> => {
  
  return await client_gestion.get<{ data: string[]; status: string }>(
    `incapacidades/listar-documentos/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadSoporte = async (id: string): Promise<any> => {

  return await client_gestion.get<any>(
    `incapacidades/download-file/${id}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getDiasIncapacidadEmpleados = async (): Promise<any> => {
  return await client_gestion.get<any>(`incapacidadesempleados`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const downloadTranscrito = async (id: string): Promise<any> => {

  return await client_gestion.get<any>(
    `incapacidades/download-transcrito/${id}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadConstancia = async (id: string): Promise<any> => {

  return await client_gestion.get<any>(
    `incapacidades/download-constancia/${id}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

