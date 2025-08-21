import { client } from "../client";
import { ResponseActivosS } from "../types";


//crear traslados
export const trasladarActiActivo = async (data: any): Promise<any> => {
  return await client.post<any>("administar-kardex-activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getActiActivosSalida = async (): Promise<ResponseActivosS> => {
  return await client.get("administar-mis-activos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getActiActivosPendientes = async (): Promise<ResponseActivosS> => {
  return await client.get("administar-kardex-activos-pendientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const getActiInfo = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`activo-informacion/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//activos por aceptar
export const getActiActivosAceptar = async (): Promise<ResponseActivosS> => {
  return await client.get("activo-pendientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//aceptar activo

//cambiar el estado de la categoria 
export const aceptarActivo = async ( id: any): Promise<any> => {
  return await client.get<any>(`activo-aceptarActivo/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//historico activos-historico

export const getActiHistorico = async (): Promise<ResponseActivosS> => {
  return await client.get("activos-historico", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

