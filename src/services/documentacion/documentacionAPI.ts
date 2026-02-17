/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseProcesosProyectos } from "@/types/typesGlobal";
import { client } from "../client";

//lamar los proyectosd con documentacion
export const getProyectosDocumentacionEmcali =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-emcali", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
  };

export const getProyectosDocumentacionCelsia =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-celsia", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
  };

export const getProyectosDocumentacionOrganismos =
  async (): Promise<ResponseProcesosProyectos> => {
    return await client.get("gestion-documentos-organismo", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
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
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
  };

//detalle de la documentacion organismos

export const getDocumentaCIonOrganismos = async (data: any): Promise<any> => {
  return await client.post<any>("detalleDocumentosOrganismos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//nopmbre de proyectos
//detalle de la documentacion
export const getNombreProyectosXCodigo = async (
  id: React.Key,
): Promise<any> => {
  return await client.get<any>(`proyectoName/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//valdiar cuantos documentos hay disponibles
export const getDocumentosDisponibles = async (
  codigo: React.Key,
): Promise<any> => {
  return await client.get<any>(`dodumentos-disponibles/${codigo}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamado de los TM torres y manzanas el proyecto
export const TmDisponiblesOrganismos = async (data: any): Promise<any> => {
  return await client.post<any>("TmDisponiblesOrganismos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//confirmar Tm de organismos
export const ConfirmarTM = async (data: any): Promise<any> => {
  return await client.post<any>("ConfirmarTM", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

/* eliminar confirmacion de actividad */

export const deleteDocumentacionProyecto = async (
  id: React.Key,
): Promise<any> => {
  return await client.get<any>(`gestion-documentos-anular/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const deleteDocumentacionProyectoCelsia = async (
  id: React.Key,
): Promise<any> => {
  return await client.get<any>(`gestion-documentos-anular-celsia/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar torres o manzanas disponibles del proyecto
export const getTorresManzasDisponibles = async (
  codigoProyecto: React.Key,
): Promise<any> => {
  return await client.get<any>(`torres-disponibles-dc-tr/${codigoProyecto}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//fechas del proyecto, entrega y real
export const getFechasProyecto = async (
  codigoDocumento: React.Key,
): Promise<any> => {
  return await client.get<any>(`fechasDocumentos/${codigoDocumento}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};