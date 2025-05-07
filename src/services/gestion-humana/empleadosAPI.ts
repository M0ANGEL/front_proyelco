/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseEmpleado } from "../types";

export const getSoportesEmpleados = async (id: string): Promise<any> => {
  
  return await client_gestion.get<{ data: string[]; status: string }>(
    `preselecciones/listar-documentos/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const downloadSoporte = async (file: string): Promise<any> => {
  return await client_gestion.get<any>(
    `preselecciones/download-file/${encodeURIComponent(btoa(file))}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getEmpleado = async (id: string): Promise<any> => {
  return await client_gestion.get<any>(`empleado-show/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};