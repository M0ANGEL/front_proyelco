/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseProcesosProyectos } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProyectosMaterial = async (): Promise<ResponseProcesosProyectos> => {
  return await client.get("proyectos-nombre-id", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const DocPlantilla = async () => {
  return await client.get("plantilla-papelera-descarga", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
    },
    responseType: "blob",
  });
};