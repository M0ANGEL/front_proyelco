/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseContratoLaboral } from "../types";

export const getContratosLaborales = async (): Promise<ResponseContratoLaboral> => {
  return await client_gestion.get("contratoslaborales", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};