// subcategoriaAPI.ts
import { Key } from "react";
import { clientActivos } from "../client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TrasladosActivos,
  ResponseTransladoActivos,
  ResponseListTransladosActivos,
  filtrosTrasladosActivos,
} from "../types";

// Obtener lista de activos
export const getListaTrasladosActivos =
  async (): Promise<ResponseListTransladosActivos> => {
    const response = await clientActivos.get<{
      data: TrasladosActivos[];
      status: string;
      total: number;
      per_page: number;
    }>(`traslados-activos`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return {
      data: response.data.data,
      status: response.data.status,
      total: response.data.total,
      per_page: response.data.per_page,
    };
  };

//mostrar los traslados en traslados salidas dependiendo del estado
export const getListaTrasladosActivosEstadosYbodegaSalidas = async (
  estado: string,
  bodega_origen: number
): Promise<ResponseListTransladosActivos> => {
  const response = await clientActivos.get<{
    data: TrasladosActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`traslados-activos-estado`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      estado: estado.toString(),
      bodega_origen: bodega_origen.toString(),
    }, // Asegúrate de que 'estado' sea una cadena
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const getListaTrasladosActivosEstadoSalida = async (
  estado: string,
  bodega_origen: number
): Promise<ResponseListTransladosActivos> => {
  const response = await clientActivos.get<{
    data: TrasladosActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`traslados-activos-estado`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      estado: estado.toString(),
      bodega_origen: bodega_origen.toString(),
    }, // Asegúrate de que 'estado' sea una cadena
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

//traer traslados para los traslados pendientes
export const getListaTrasladosActivosPorBodegaYEstado = async (
  estado: string,
  bodega_destino: number // Aquí pasas el ID de la bodega de origen
): Promise<ResponseListTransladosActivos> => {
  const response = await clientActivos.get<{
    data: TrasladosActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(`traslados-activos-estados-bodega`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      estado: estado.toString(), // Asegúrate de que 'estado' sea una cadena
      bodega_destino: bodega_destino.toString(), // Asegúrate de que 'idBodegaOrigen' sea una cadena
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

// Obtener información de los activos
export const getTrasladosActivos = async (
  id: number
): Promise<ResponseTransladoActivos> => {
  const response = await clientActivos.get<{
    data: TrasladosActivos;
    status: string;
  }>(`traslados-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};

// Crear un nuevo activo
export const crearTrasladosActivos = async (
  data: TrasladosActivos,
  user_id: number
): Promise<any> => {
  return await clientActivos.post<any>("traslados-activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      user_id: user_id.toString(),
    },
  });
};



export const aceptarTrasladoAdmin = async (
  id_trasladoActivo: number,
  userId: number
): Promise<ResponseListTransladosActivos> => {
  const response = await clientActivos.post<{
    data: TrasladosActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(
    `traslados-activos-aceptar-admin`,
    {
      id_trasladoActivo: id_trasladoActivo,
      userId: userId,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


export const aceptarTrasladoGerencia = async (
  id_trasladoActivo: number,
  userId: number
): Promise<ResponseListTransladosActivos> => {
  const response = await clientActivos.post<{
    data: TrasladosActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(
    `traslados-activos-aceptar-gerencia`,
    {
      id_trasladoActivo: id_trasladoActivo,
      userId: userId,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};



//aceptar un traslado de activos
export const aceptarTraslado = async (
  id_trasladoActivo: number,
  userId: number,
  observacion: string
): Promise<ResponseListTransladosActivos> => {
  const response = await clientActivos.post<{
    data: TrasladosActivos[];
    status: string;
    total: number;
    per_page: number;
  }>(
    `traslados-activos-aceptar`,
    {
      id_trasladoActivo: id_trasladoActivo,
      userId: userId,
      observacion: observacion,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

// Actualizar un activo existente
export const updateTrasladosActivos = async (
  id: number,
  data: TrasladosActivos,
  id_user: number
): Promise<any> => {
  return await clientActivos.put<any>(`traslados-activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      id_user: id_user,
    },
  });
};

// Eliminar un activo
export const deleteTrasladosActivos = async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`traslados-activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Método para obtener la lista de activos con filtros
export const getListaTrasladoActivosFiltrados = async (
  filtros: filtrosTrasladosActivos
): Promise<ResponseListTransladosActivos> => {
  const response = await clientActivos.get<{
    data: TrasladosActivos[];
    status: string;
    total: number;
    per_page: number;
  }>("traslados-activos-filtrados", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      filtros,
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

// Anular un traslado pendiente
export const anularTrasladoActivo = async (
  id: Key,
  id_user: number
): Promise<any> => {
  return await clientActivos.put<any>(
    `traslados-activos-anular/${id}`,
    {
      id_user: id_user,
    },
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
};
