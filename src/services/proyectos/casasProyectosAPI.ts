/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";



//Iniciar Proyecto 
export const IniciarProyectoCasas = async ( id: any): Promise<any> => {
  return await client.delete<any>(`gestion-proyectos-casas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// //detalle del proyecto
export const getProyectoDetalleGestionCasa = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`gestion-proyectos-detalle-casa/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};




export const IniciarManzana = async (data: any): Promise<any> => {
  return await client.post<any>("gestion-iniciar-manzana", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// //detalle del proyecto
export const InfoProyectoCasa = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`info-proyecto-casa/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//confirmar proceos casas 
export const confirmarCasaGestion = async ( id: any): Promise<any> => {
  return await client.get<any>(`gestion-confirmar-confirmarCasas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//confirmar apartamento 
export const confirmarValidacionCasa = async ( data: any): Promise<any> => {
  return await client.post<any>(`gestion-confirmar-validar-casa`, data,{
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

//llamdo de graficas para proyectos
export const detalleCasa = async (data: any): Promise<any> => {
  return await client.post<any>("casas-infoCasa", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


export const cambioestadoCasasAnulacion = async (data: any): Promise<any> => {
  return await client.post<any>("CambioEstadosCasas-anulacion", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
}; 




