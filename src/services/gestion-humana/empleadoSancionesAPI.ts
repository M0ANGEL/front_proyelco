/* eslint-disable @typescript-eslint/no-explicit-any */
import { client_gestion } from "../client";
import { ResponseEmpleadoSancion } from "../types";

export const getEmpleadoSanciones = async (): Promise<ResponseEmpleadoSancion> => {
  return await client_gestion.get("empleadosanciones", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};