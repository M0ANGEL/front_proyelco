// subcategoriaAPI.ts
import { clientActivos } from "../client";
import { Parametro, ResponseListParametros, ResponseParametros} from "../types";


// Obtener lista de parametros
export const getListaParametros = async (
): Promise<ResponseListParametros> => {
  const response = await clientActivos.get<{
    data: Parametro[];
    status: string;
    total: number;
    per_page: number;
  }>(`parametro`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


// Obtener información de una parametros
export const getParametro = async (id: number): Promise<ResponseParametros> => {
  const response = await clientActivos.get<{
    data: Parametro;
    status: string;
  }>(`parametro/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};

// Crear una nueva parametros
export const crearParametro = async (data: Parametro): Promise<any> => {
  return await clientActivos.post<any>("parametro", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Actualizar una parametros existente
export const updateParametro = async (id: number, data: Parametro): Promise<any> => {
  return await clientActivos.put<any>(`parametro/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Eliminar una parametros
export const deleteParametro = async (id: number): Promise<any> => {
  return await clientActivos.delete<any>(`parametro/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const actualizarEstadoParametro = async (id:number, estado: string): Promise<any> => {
  return await clientActivos.put<any>(`actualizar-estado-parametro/${id}`,
    {
      estado : estado,
    },
    {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  };


  export const verificarRelacionParametro = async (id: number) => {
    try {
        const response = await clientActivos.get<any>(`parametroSubCategoria-verificarRelaciones/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        // Devuelve el data directamente si el status es success
        if (response.data.status === "success") {
            return response.data.data;
        } else {
            throw new Error("No se pudo verificar las relaciones.");
        }
    } catch (error) {
        console.error("Error en verificarRelacionParametro:", error);
        throw error;
    }
};

  


  export const getListaParametrosActivas = async (
  ): Promise<ResponseListParametros> => {
    const response = await clientActivos.get<{
      data: Parametro[];
      status: string;
      total: number;
      per_page: number;
    }>(`parametros-activas`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  
    // Asegurar que la respuesta coincide con ResponseListaCategorias
    return {
      data: response.data.data,
      status: response.data.status,
      total: response.data.total,
      per_page: response.data.per_page,
    };
  };
