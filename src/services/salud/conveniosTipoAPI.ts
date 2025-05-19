/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  ResponseCoberturaPlanBeneficios,
  ResponseModalidadContrato,
  CoberturaPlanBeneficios,
  ResponseConvenioTipo,
  ResponseTipoConsulta,
  ResponseListapreCli,
  ModalidadContrato,
  ResponseTerceros,
  ConvenioTipo,
  ListaPrecios,
  TipoConsulta,
  ResponseAmClientes,
  ResponseTipoProyectos,
} from "../types";

export const getTipoConvenio = async (): Promise<ResponseConvenioTipo> => {
  return await client.get<{ data: ConvenioTipo[]; status: string }>(
    `tipo-convenio`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getCoberPlanB =
  async (): Promise<ResponseCoberturaPlanBeneficios> => {
    return await client.get<{
      data: CoberturaPlanBeneficios[];
      status: string;
    }>(`cober-planb`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getModContrato = async (): Promise<ResponseModalidadContrato> => {
  return await client.get<{ data: ModalidadContrato[]; status: string }>(
    `mod-contrato`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getTipoConsulta = async (): Promise<ResponseTipoConsulta> => {
  return await client.get<{ data: TipoConsulta[]; status: string }>(
    `tipo-consulta`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

//llamado de los tipos de proyectos 
export const getTipoProyectos = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`tipo-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//llamado de los tipos de procesos 
export const getProcesosProyectos = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`procesos-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamado de los tipos de proyectos 
export const getValidacionesProcesos = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`validacion-procesos-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//llamada de los cleintes
export const getCLientesNIT= async (): Promise<ResponseAmClientes> => {
  return await client.get("admin-clientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamado de usuarios para proyecto
export const getUsersProyecto = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`usuarios-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamado de los ingenieros de obras
export const getIngenieros = async (): Promise<ResponseTipoProyectos> => {
  return await client.get<{ data: any; status: string }>(`ingenieros-proyectos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};










