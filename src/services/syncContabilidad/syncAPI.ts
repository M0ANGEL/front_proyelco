
import { client } from '../client';
import { Bodega, Empresa, ResponseBodegas, ResponseDocSync, ResponseDocumentoInt, ResponseEmpresa, ResponseEmpresas, ResponseGrupos, ResponseSearchConvenios} from '../types';


export const getGrupos = async (): Promise<ResponseGrupos> => {
    return await client.get("grupos", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getTiposDocumentos = async (data:any): Promise<ResponseDocumentoInt> => {
    return await client.post("/syncList/tipos_documentos",data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getListDocumentos = async (data:any): Promise<ResponseDocSync> => {
    return await client.post("/syncList",data ,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const enviarSync = async (data:any): Promise<ResponseDocSync> => {
    return await client.post("/syncList/crear",data ,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const cambiarEstado = async (data:any): Promise<ResponseDocumentoInt> => {
    return await client.post("/syncList/cambio-estado",data ,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };


  export const getEmpresa = async (
    id_empresa: string
  ): Promise<ResponseEmpresa> => {
    const data = {
      id_empresa,
    };
    return await client.post<{ data:Empresa; status: string }>(
      "/syncList/empresa",
      data,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };
  export const enviarSyncProductos = async (): Promise<ResponseDocSync> => {
    return await client.get("/syncProductos",{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getConvenios = async (): Promise<ResponseSearchConvenios> => {
  return await client.get("convenios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getBodegas = async (): Promise<ResponseBodegas> => {
  return await client.get<{ data: Bodega[]; status: string }>("/syncList/bodegas", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
