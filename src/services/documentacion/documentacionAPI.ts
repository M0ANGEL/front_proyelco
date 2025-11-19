/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseProcesosProyectos } from "@/types/typesGlobal";
import { client } from "../client";

//lamar los proyectosd con documentacion
export const getProyectosDocumentacionEmcali =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-emcali", {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
    });
  };

export const getProyectosDocumentacionCelsia =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-celsia", {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
    });
  };


  export const getProyectosDocumentacionOrganismos =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-organismo", {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
    });
  };

//detalle de la documentacion
export const getDocumentaCIonProyecto = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`gestion-documentosDetalle/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar proyectos y sus codigos para crear documentos
export const getProyectosCodigo =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-proyectos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
    });
  };


  //detalle de la documentacion organismos

export const getDocumentaCIonOrganismos = async (data: any): Promise<any> => {
  return await client.post<any>("detalleDocumentosOrganismos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};
