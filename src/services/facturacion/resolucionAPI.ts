/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../client';
import {Resolucion, ResponseInfResolucion, ResponseResolucion, ResponseResolucionList, ResponseSearchConvenio } from '../types'

export const getListaResolucion = async (): Promise<ResponseResolucion> => {
    return await client.get<Resolucion[] | any>(`list-resolucion/convenio`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

  export const getListaResolucionPrin = async (): Promise<ResponseResolucionList> => {
    return await client.get<Resolucion[] | any>(`resolucion`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

  export const setStatusResol = async (id: React.Key): Promise<any> => {
    return await client.delete<any>(`resolucion/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const crearResolucion = async (data: any): Promise<any> => {
    return await client.post<any>("resolucion", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const updateResolucion = async (data: any, id: any): Promise<any> => {
    return await client.put<any>(`resolucion/${id}`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getResolucion = async (id: string): Promise<ResponseInfResolucion> => {
    return await client.get<{ data: Resolucion; status: string }>(
      `resolucion/${id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

  export const getConvenios = async (): Promise<ResponseSearchConvenio> => {
    return await client.get("convenios", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };