// subcategoriaAPI.ts
import axios from "axios";
import { clientActivos } from "../client";
import {Parametros_SubCategoria, Datos, ResponceDatos, ResponseListDatos, DatosCrear} from "../types";

const API_BASE_URL = 'http://localhost/activosbackend/public/api';



// Obtener lista de datos
export const getListaDatos = async (
): Promise<ResponseListDatos> => {
  const response = await clientActivos.get<{
    data: Datos[];
    status: string;
    total: number;
    per_page: number;
  }>(`datos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

//obtener Parametros_subCategoria para mostrarlas en la pagina
export const getListaParametros_SubCategoria = async (): Promise<{ data: Parametros_SubCategoria[] }> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/parametro-sub-categoria`);
      return response.data;
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Error desconocido al obtener los parametros x subCategoria';
      throw new Error(message);
    }
  };



// Obtener información de los datos
export const getDatos = async (id: number): Promise<ResponceDatos> => {
  const response = await clientActivos.get<{
    data: Datos;
    status: string;
  }>(`datos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};


// Crear un nuevo dato 
export const crearDato = async (data: DatosCrear): Promise<any> => {
  return await clientActivos.post<any>("datos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Actualizar un dato existente
export const updateDato = async (id: number, data: DatosCrear): Promise<any> => {
  return await clientActivos.put<any>(`datos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Eliminar una parametros
export const deleteDato = async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`datos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
