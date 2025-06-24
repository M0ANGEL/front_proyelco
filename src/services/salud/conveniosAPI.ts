/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";


export const getConveniosActivos = async (): Promise<any> => {
  return await client.get("convenios-on", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusConvenio = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`convenios/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const crearConvenio = async (data: any): Promise<any> => {
  return await client.post<any>("convenios", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateConvenio = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`convenios/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getReportConvenios = async (): Promise<any> => {
  return await client.get(`convenios/reporte/all`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};


