/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponsePension } from "../types";

export const getTrazabilidad = async (id: React.Key): Promise<any> => {
  return await client_gestion.get<any>(`trazabilidadempleados/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};