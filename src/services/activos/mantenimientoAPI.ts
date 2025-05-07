/* eslint-disable @typescript-eslint/no-explicit-any */
// subcategoriaAPI.ts
import { clientActivos } from "../client";
import {
  Mantenimiento,
  ResponseMantenimiento,
  ResponseListMantenimiento,
} from "../types";

// Obtener lista de mantenimientos
export const getListaMantenimientos =
  async (): Promise<ResponseListMantenimiento> => {
    const response = await clientActivos.get<{
      data: Mantenimiento[];
      status: string;
      total: number;
      per_page: number;
    }>(`mantenimientos`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return {
      data: response.data.data,
      status: response.data.status,
      total: response.data.total,
      per_page: response.data.per_page,
    };
  };

// Obtener información de los mantenimiento
export const getMantenimiento = async (
  id: number
): Promise<ResponseMantenimiento> => {
  const response = await clientActivos.get<{
    data: Mantenimiento;
    status: string;
  }>(`mantenimientos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};

// Crear un nuevo mantenimiento
export const crearMantenimiento = async (data: FormData): Promise<any> => {
  return await clientActivos.post<any>("mantenimientos", data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

// Actualizar un mantenimiento existente
export const updateMantenimiento = async (
  id: number,
  data: Mantenimiento
): Promise<any> => {
  return await clientActivos.put<any>(`mantenimientos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Eliminar un mantenimiento
export const deleteMantenimiento = async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`mantenimientos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const handleUpdateEstado = async (
  id: number,
  estado: string
): Promise<any> => {
  return await clientActivos.get<any>(`mantenimientos-cambiar-estado/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      id: id,
      estado: estado,
    },
  });
};

export const getAdjuntos = async (mantenimientoId: number): Promise<any> => {
  return await clientActivos.get<any>(
    `mantenimientos-adjuntos/${mantenimientoId}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: {
        id: mantenimientoId,
      },
    }
  );
};

export const descargarAdjuntos = async (
  mantenimientoId: number,
  nombreArchivo: string
): Promise<any> => {
  return await clientActivos.get<any>(
    `mantenimiento-descargar-adjunto/${mantenimientoId}`,
    {
      responseType: "arraybuffer",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: {
        mantenimientoId: mantenimientoId,
        nombreArchivo: nombreArchivo, // Añade el nombre del archivo a los parámetros
      },
    }
  );
};

export const aceptarMantenimiento = async (
  mantenimientoId: number,
  idUser: number
): Promise<any> => {
  return await clientActivos.get<any>(
    `mantenimiento-aceptar/${mantenimientoId}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: {
        idUser: idUser,
      },
    }
  );
};


export const RenovarMantenimiento = async (
  data: FormData, 
  idUser: number,
  mantenimientoId: number,
): Promise<any> => {
  return await clientActivos.post<any>(
    `mantenimiento-renovar/${mantenimientoId}`,data,
    {
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}` ,
      },
      params: {
        idUser: idUser,
      },
    }
  );
};

// Método para eliminar un archivo de un mantenimiento
export const eliminarAdjunto = async (
  mantenimientoId: number,
  nombreArchivo: string
): Promise<any> => {
  return await clientActivos.delete(
    `eliminar-archivo-mantenimiento/${mantenimientoId}`,
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: {
        mantenimientoId: mantenimientoId,
        nombreArchivo: nombreArchivo,
      },
    }
  );
};

export const cargarAdjuntosMantenimientos = async (
  data: FormData,
  id: number
): Promise<any> => {
  return await clientActivos.post<any>(`cargar-adjuntos-mantenimientos/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}` ,
      "Content-Type": "multipart/form-data"
    },
  });
};
