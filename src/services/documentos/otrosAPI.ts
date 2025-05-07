/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import {
  Privilegios,
  ResponseDocumento,
  ResponseInfoSOB,
  ResponseListaSOB,
  DocumentosCabecera,
  ResponseListaOtrDoc,
  ResponseSearchTerceros,
  Tercero,
  DocumentosCabeceraEntradas,
  ResponseInfoEntrada,
  ResponseInfoSalida,
  ResponseProductosLote,
  ProductoLote,
} from "../types";

export const validarAccesoDocumento = async (
  codigo_documento: string,
  id_empresa: string
): Promise<ResponseDocumento> => {
  const data = {
    codigo_documento,
    id_empresa,
  };
  return await client.post<{ data: Privilegios; status: string }>(
    "validar-documento",
    data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getListOtr = async (): Promise<ResponseListaSOB> => {
  return await client.get<DocumentosCabecera[]>(`otrosDocumentos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const crearDocumento = async (data: any): Promise<any> => {
  return await client.post<any>("otrosDocumentos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getDocumentos = async (id: string): Promise<ResponseInfoSOB> => {
  return await client.get<{ data: DocumentosCabecera; status: string }>(
    `getDocumentos/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getListaOtrosDocumentos = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string,
  codigo_documento?: string
): Promise<ResponseListaOtrDoc> => {
  return await client.get(
    `getListaOtrosDocumentos?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}&codigo_documento=${codigo_documento}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getProductosLotes = async (
  data: any
): Promise<ResponseProductosLote> => {
  return await client.post<{ data: ProductoLote[]; status: string }>(
    "prestamos-pagos",
    data,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const updateDocumentos = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`otrosDocumentos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getInfoEntrada = async (
  id: string
): Promise<ResponseInfoEntrada> => {
  return await client.get<{ data: DocumentosCabeceraEntradas; status: string }>(
    `otrosDocumentos/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoSalida = async (
  id: string
): Promise<ResponseInfoSalida> => {
  return await client.get<{ data: DocumentosCabecera; status: string }>(
    `otrosDocumentos/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getOtrosPdf = async (otros_id: string): Promise<any> => {
  return await client.get(`otrosDocumentos/pdf/` + otros_id, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getExcel = async (
  cabecera_id: string,
  bodega_id: string,
  tipo_documento_id: string
): Promise<any> => {
  return await client.get(
    `otrosDocumentos/prestamos-excel/${cabecera_id}/${bodega_id}/${tipo_documento_id}`,
    {
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const deleteDetalle = async (data: any): Promise<any> => {
  return await client.post<any>(`otrosDocumentos/delete-det`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const anularDoc = async (data: any): Promise<any> => {
  return await client.post("otrosDocumentos/anular", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
export const deleteItem = async (data: any): Promise<any> => {
  return await client.post<any>("otrosDocumentos/otrosdelete", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getListaOtrDoc = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string,
  tipo_documento?: string
): Promise<ResponseListaOtrDoc> => {
  return await client.get(
    `otrosDocumentosListar?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}&doc=${tipo_documento}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getInfoSOB = async (id: string): Promise<ResponseInfoSOB> => {
  return await client.get<{ data: DocumentosCabecera; status: string }>(
    `otrosDocumentos/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const crearOtrDoc = async (data: any): Promise<any> => {
  return await client.post<any>("otrosDocumentos/create", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updateOtrDoc = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`otrosDocumentos/update/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const cambiarEstadoOtrDoc = async (data: any): Promise<any> => {
  return await client.post("otrosDocumentos/otros-estado", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getPDF = async (
  tipo_doc: string,
  sob_id: string
): Promise<any> => {
  return await client.get(`otrosDocumentos/pdf/${tipo_doc}/${sob_id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const updatePrestamos = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`otrosDocumentos/${id}/updatePrestamos`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const downloadTemplate = async (filename: string): Promise<any> => {
  return await client.get(`downloadTemplate/${filename}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getGestionPeriodos = async (id: string): Promise<any> => {
  return await client.get<{ data: string; status: string }>(
    `/gestionperiodos/${id}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getMotivos = async (): Promise<any> => {
  return await client.get<{ data: string; status: string }>(`/getmotivos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const anyTerceros = async (
  query: string
): Promise<ResponseSearchTerceros> => {
  return await client.get<{ data: Tercero[]; status: string }>(
    `terceros-type/${query}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};

export const getListaPrestamos = async (
  page = 1,
  bodega_id: string,
  estado: string,
  query?: string,
  codigo_documento?: string
): Promise<ResponseListaOtrDoc> => {
  return await client.get(
    `getListaPrestamos?page=${page}&bodega_id=${bodega_id}&estado=${estado}&value=${query}&codigo_documento=${codigo_documento}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
