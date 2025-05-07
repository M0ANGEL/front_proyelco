/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseResolucionFacturacion } from "../types";

export const getResolucionPorVencer = async (): Promise<ResponseResolucionFacturacion> => {
  return await client.get("resolucionesporvencer", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getResolucionPorAcabar = async (): Promise<ResponseResolucionFacturacion> => {
    return await client.get("resolucionesporacabar", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };