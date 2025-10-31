/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseProcesosProyectos } from "../types";

//lamar los proyectosd con documentacion
export const getProyectosDocumentacionEmcali =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-emcali", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getProyectosDocumentacionCelsia =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-celsia", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

//detalle de la documentacion
export const getDocumentaCIonProyecto = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`gestion-documentosDetalle/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar proyectos y sus codigos para crear documentos
export const getProyectosCodigo =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-proyectos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

