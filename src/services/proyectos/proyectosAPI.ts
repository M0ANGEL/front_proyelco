/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseAmClientes, ResponseProcesosProyectos, ResponseProyectos } from "@/types/typesGlobal";
import { client } from "../client";

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProcesosProyecto = async (): Promise<ResponseProcesosProyectos> => {
  return await client.get("procesos-proyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar todas los proyectos get
export const getProyectos = async (): Promise<ResponseProcesosProyectos> => {
  return await client.get("administracion-proyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//crear la categoria
export const crearProyecto = async (data: any): Promise<any> => {
  return await client.post<any>("administracion-proyectos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver de la categoria por id
export const getProyectoID = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administracion-proyectos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar la categoria
export const updateAmCliente = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`admin-clientes/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cambiar el estado de la categoria 
export const DeleteProyecto = async ( id: any): Promise<any> => {
  return await client.delete<any>(`administracion-proyectos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//ver de la categoria por id
export const getProyectoDetalle = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`administracion-proyectos-detalle/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//actualizar la categoria
export const updateProyecto = async (data: any, id: any): Promise<any> => {
  return await client.put<any>(`administracion-proyectos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//ver de la categoria por id
export const getNomenclaturas = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`nomenclaturas/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//actualizar Nomenclatura
export const actualizarNomenclatura = async (data: any): Promise<any> => {
  return await client.post<any>("ActualizarNomenclaturas", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//llamar todas los proyectos que no llevan movimiento hace un dia
export const getProyectosSinMovimientos = async (): Promise<ResponseProyectos> => {
  return await client.get("obras-sin-movimientos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar todas los proyectos que no llevan movimiento hace un dia
export const getProyectosSinMovimientosIng = async (): Promise<ResponseProyectos> => {
  return await client.get("obras-sin-movimientos-ing", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//cambiar el estado de los proyectos casas 
export const DeleteProyectoCasa = async ( id: any): Promise<any> => {
  return await client.delete<any>(`activar-proyecto/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};



//unidad de medida
export const PostUnidadDeMedida = async (data: any): Promise<any> => {
  return await client.post<any>("UnidadDeMedida", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

//llamar todas los clientes usaremos Am = para identificar que es de adminisracion
export const getProcesosProyectoUnidad = async (): Promise<ResponseProcesosProyectos> => {
  return await client.get("proyectosUnidadMedida", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

export const getCLientesNIT= async (): Promise<ResponseAmClientes> => {
  return await client.get("admin-clientes", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//llamdo de graficas para proyectos
export const getGrafiaPoryectos = async (): Promise<any> => {
  return await client.get("dashboards/indexMisProyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};



//llamdo de graficas para proyectos
export const fetchProjectDetalle = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`dashboards/proyectosDetalles/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};


//llamdo de graficas para proyectos
export const detalleApt = async (data: any): Promise<any> => {
  return await client.post<any>("dashboards/infoApt", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};



export const getEstadoTramitesAdmin = async () => {
  return await client.get<any>('/estado-tramites-adminitrador', {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};