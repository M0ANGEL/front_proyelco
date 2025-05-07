// subcategoriaAPI.ts
import { clientActivos } from "../client";
import { ResponseListRetornoActivoProovedor, responseRetornoAactivoProovedor, RetornoActivoProovedor } from "../types";




// Obtener lista de activos
export const getListaRetornoActivoProovedor = async (
): Promise<ResponseListRetornoActivoProovedor> => {
  const response = await clientActivos.get<{
    data: RetornoActivoProovedor[];
    status: string;
    total: number;
    per_page: number;
  }>(`retorno-activo-proovedor`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

// Método para obtener la lista de activos con filtros
export const getListaRetornoActivoProovedorXEstado= async (
 estado:string,
): Promise<ResponseListRetornoActivoProovedor> => {
  const response = await clientActivos.get<{
    data: RetornoActivoProovedor[];
    status: string;
    total: number;
    per_page: number;
  }>(
    'retorno-activos-proovedor-estado', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      params: {
        estado,
      }
    });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


// Obtener información de los activos
export const getRetornoActivoProovedor = async (id: number): Promise<responseRetornoAactivoProovedor> => {
  const response = await clientActivos.get<{
    data: RetornoActivoProovedor;
    status: string;
  }>(`retorno-activo-proovedor/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
  };
};


// Crear un nuevo activo
export const crearRetornoActivoProovedor = async (data: RetornoActivoProovedor): Promise<any> => {
  return await clientActivos.post<any>("retorno-activo-proovedor", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
    },
  });
};

// Actualizar un activo existente
export const updateRetornoActivoProovedor = async (id: number, data: RetornoActivoProovedor): Promise<any> => {
  return await clientActivos.put<any>(`retorno-activo-proovedor/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
   
  });
};

export const cancelarRetornoActivoProvedor = async(id_retorno: number, user_id: number): Promise<any> => {
  return await clientActivos.put<any>(`retorno-activo-proovedor-cancelar/${id_retorno}`,{
    user_id: user_id,},{
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      user_id: user_id.toString(),
    }
  });
};

// Eliminar un activo
export const deleteRetornoActivoProovedor = async (id: React.Key, id_usuario: number): Promise<any> => {
  return await clientActivos.delete<any>(`retorno-activo-proovedor/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params:{
      user_id : id_usuario.toString(),
    }
  });
};


//traer solicitudes de activos pendientes por su estado y bodega
export const getRetornoActivoProovedorBodega = async (
  localizacion: number 
): Promise<ResponseListRetornoActivoProovedor> => {
  const response = await clientActivos.get<{
    data: RetornoActivoProovedor[];
    status: string;
    total: number;
    per_page: number;
  }>(`retorno-activo-proovedor-bodega`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      localizacion: localizacion.toString(), // Asegúrate de que 'idBodegaOrigen' sea una cadena
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};


export const aceptarRetornoActivoProovedor = async (
  id: number,
  userId: number,
): Promise<ResponseListRetornoActivoProovedor> =>{
  const response = await clientActivos.post<any>(`activos-retorno-aceptar/${id}`, {
    userId: userId,
  },{
      headers: {Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return{
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  }
}

export const rechazarRetornoActivoProovedor = async (
    id: number,
    userId: number,
  ): Promise<ResponseListRetornoActivoProovedor> =>{
    const response = await clientActivos.post<any>(`retorno-activo-proovedor-rechazar/${id}`, {
      userId: userId,
    },{
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return{
      data: response.data.data,
      status: response.data.status,
      total: response.data.total,
      per_page: response.data.per_page,
    }
  }

  export const cargarAdjuntosRetornos = async (
    data: FormData,
    id: number
  ): Promise<any> => {
    return await clientActivos.post<any>(
      `cargar-adjuntos-retorno/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  export const getAdjuntosRetorno = async (
    id: number
  ): Promise<any> => {
    return await clientActivos.get<any>(`retorno-activos-adjuntos/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: {
        id: id,
      },
    });
  };

  export const descargarAdjuntosRetorno = async (
    id: number,
    nombreArchivo: string,
    carpeta: string,
  ): Promise<any> => {
    return await clientActivos.get<any>(
      `descargar-archivos-retorno/${id}`,
      {
        responseType: "arraybuffer",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: {
          id: id,
          nombreArchivo: nombreArchivo, // Añade el nombre del archivo a los parámetros
          carpeta: carpeta,
        },
      }
    );
  };


  export const eliminarAdjuntosRetorno = async (
    id: number,
    nombreArchivo: string,
    carpeta: string,
  ): Promise<any> => {
    return await clientActivos.delete(
      `eliminar-archivos-retorno/${id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: {
          id: id,
          nombreArchivo: nombreArchivo,
          carpeta: carpeta,
        },
      }
    );
  };

  



