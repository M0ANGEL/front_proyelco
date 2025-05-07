/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { client } from "../client";
import { ResponseListaFacturaFVE, ResponseSearchConvenios } from '../types'

export const getListaFacturaFVE = async (data: any): Promise<ResponseListaFacturaFVE> => {
  let url="";
  data.data.numero_fve === "" || data.data.numero_fve ===undefined ?
    url=`/listar-fve`: url= `/list-fveDoc`;
  return await client.post<any>(
    url, data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const generacionCufe = async (data: any): Promise<any> => {
  return await client.post<any>(
    `/facturar-fve`, data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getRPGrafica = async (
  tipo_doc: string,
  id: string,
  tipoDoc: string
): Promise<any> => {
  return await client.get(`/prefactura/pdf/${id}/${tipo_doc}/${tipoDoc}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getConvenios = async (): Promise<ResponseSearchConvenios> => {
  return await client.get("convenios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const anularDoc = async (
  id: React.Key,
  tipoDoc: string,
  convenio:string,
): Promise<any> => {
  return await client.get(`/anular-fve/${id}/${tipoDoc}/${convenio}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const anulacionMasiva = async (data: any): Promise<any> => {
  return await client.post<any>(
    `/anulacion-masiva-fve`, data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

