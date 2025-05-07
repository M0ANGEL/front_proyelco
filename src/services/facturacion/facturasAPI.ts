import { client } from '../client';
import {Bodega, ResponseBodegas, ResponseListaFacturaVtaDis, ResponseSearchConvenios, ResponseSearchTercero, Tercero, ResponseSearchConvenioUsuarios } from '../types'

export const getListaFacturaVtaDis = async (data:any): Promise<ResponseListaFacturaVtaDis> => {
  let url="";
  data.data.numero_doc === "" || data.data.numero_doc ===undefined ?
  url=`/listar-dispensaciones`: url= `/listar-documentos`;
    return await client.post<any>(
      url,data,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

  export const generarFVE = async (data: any): Promise<any> => {
    return await client.post<any>("/pre-factura", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  // consultar la lista de proveedores
  export const searchTerceros = async (data :string): Promise<ResponseSearchTercero> => {
    return await client.get<{ data: Tercero; status: string }>(
      `/prefactura/listcliente/${data}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

  export const getConvenios = async (): Promise<ResponseSearchConvenios> => {
    return await client.get("convenios", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getConveniosUsuarios = async (): Promise<ResponseSearchConvenioUsuarios> => {
    return await client.get("convenios-usuarios", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getTipoDoc = async (): Promise<ResponseSearchConvenios> => {
    return await client.get("tipoDocumento", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const downloadZip = async (data:any): Promise<any> => {
    return await client.post(`images-dispensaciones`,data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getBodegas = async (): Promise<ResponseBodegas> => {
    return await client.get<{ data: Bodega[]; status: string }>("bodegas", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const generarInformeGeneral = async (data: any): Promise<any> => {
    return await client.post(`informe-dis`, data, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };
