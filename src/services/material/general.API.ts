/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseProcesosProyectos } from "../types";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProyectosMaterial = async (): Promise<ResponseProcesosProyectos> => {
  return await client.get("proyectos-nombre-id", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};