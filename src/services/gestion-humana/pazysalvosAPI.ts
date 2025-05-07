/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponsePension } from "../types";

export const crearPazYSalvo = async (data: any): Promise<any> => {
  return await client_gestion.post<any>("pazysalvos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};