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

export const getConcepto = async (): Promise<ResponseConvenioTipo> => {
  return await client.get<{ data: any; status: string }>(`conceptos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListapreCli = async (): Promise<ResponseListapreCli> => {
  return await client.get<{ data: ListaPrecios[]; status: string }>(
    `listaprecli`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};


//llamada de los cleintes
export const getCLientesNIT= async (): Promise<ResponseAmClientes> => {
  return await client.get("admin-clientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getTerceros = async (page = 1): Promise<ResponseTerceros> => {
  return await client.get<{ data: any; status: string }>(
    `terceros?page=${page}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getTerceroTipo = async (id: string): Promise<any> => {
  return await client.get<any>(`tercero-tipos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//crear proyecto
export const crearTerceroTipo = async (data: any): Promise<any> => {
  return await client.post<any>("tercero-tipos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//actualizar poryecto si no inicia aun
export const updateTerceroTipo = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`tercero-tipos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const setStatusTerceroTipo = async (id: React.Key): Promise<any> => {
  return await client.delete<any>(`tercero-tipos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getConceptosPorConvenio = async (
  convenio_id: string | number
): Promise<any> => {
  return await client.get(`conceptos/${convenio_id}/convenio`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getProductosPorConvenio = async (
  lista_id: string | number
): Promise<any> => {
  return await client.get(`productos/${lista_id}/convenio`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getNitTerceroProv = async (
  page = 1,
  query?: string
): Promise<ResponseConvenioTipo> => {
  return await client.get<{ data: any; status: string }>(
    `nit_proveedor?page=${page}&value=${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
