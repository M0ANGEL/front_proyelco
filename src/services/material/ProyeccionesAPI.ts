/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseProyeccion } from "@/types/typesGlobal";
import { client } from "../client";

// Obtener todos los proyectos de proyecciones
export const getProyectosProyeciones =
  async (): Promise<ResponseProyeccion> => {
    return await client.get("proyectos-proyeccio", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
  };

// Obtener proyección por ID
export const getProyeccionUnica = async (
  codigo_proyecto: React.Key
): Promise<any> => {
  return await client.get<any>(`proyeccionData/${codigo_proyecto}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
  });
};

// services/material/ProyeccionesAPI.ts
export const PostgenerarExcelAxuiliarMaterial = async (
  data: any
): Promise<any> => {
  const response = await client.post("generarExcelAxuiliarMaterial", data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      "Content-Type": "application/json",
    },
    responseType: "blob", // IMPORTANTE: Para recibir el archivo Excel
  });

  return response;
};

// Actualizar múltiples items de proyección
export const updateProyeccionItems = async (
  updates: Array<{
    id: number;
    [key: string]: any;
  }>
): Promise<any> => {
  return await client.post<any>(
    "proyecion-material-update",
    { updates },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// Crear nuevo item de proyección
export const createProyeccionItem = async (nuevoItem: {
  codigo_proyecto: string;
  codigo: string;
  descripcion: string;
  padre: string;
  nivel: number;
  um: string;
  cantidad?: string;
  cant_total?: string;
  valor_sin_iva?: string;
  tipo_insumo: string;
  agrupacion?: string;
  cant_solicitada?: string;
  estado?: number;
}): Promise<any> => {
  return await client.post<any>("proyeccion-items", nuevoItem, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      "Content-Type": "application/json",
    },
  });
};

// Eliminar item de proyección (eliminación lógica)
export const deleteProyeccionItem = async (id: number): Promise<any> => {
  return await client.delete<any>(`proyeccion-items/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      "Content-Type": "application/json",
    },
  });
};

// Alternativa: Eliminación lógica (marcar como inactivo)
export const deleteProyeccionItemLogico = async (id: number): Promise<any> => {
  return await client.patch<any>(
    `proyeccion-items/${id}/estado`,
    { estado: 0 },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// Servicio adicional: Actualizar cantidad solicitada individual
export const updateCantidadSolicitada = async (
  id: number,
  cant_solicitada: number
): Promise<any> => {
  return await client.patch<any>(
    `proyeccion-items/${id}/cantidad-solicitada`,
    { cant_solicitada },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// Servicio adicional: Obtener items modificados recientemente
export const getItemsModificados = async (
  codigo_proyecto: string
): Promise<any> => {
  return await client.get<any>(
    `proyeccion-items/modificados/${codigo_proyecto}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    }
  );
};


/* SOLICITUDES INGENIEROS */
/* ENVIAR DATA PARA SOLICITUD */
// services/material/ProyeccionesAPI.ts
// export const postEnviarSolicitud = async (
//   data: any
// ): Promise<any> => {
//   const response = await client.post("solicitud-maetiral-ingenieros", data, {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
//       "Content-Type": "application/json",
//     },
//     responseType: "blob", // IMPORTANTE: Para recibir el archivo Excel
//   });

//   return response;
// };

export const postEnviarSolicitud = async (data: any): Promise<any> => {
  try {
    const response = await client.post("solicitud-maetiral-ingenieros", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        "Content-Type": "application/json",
      },
      responseType: "blob",
    });

    // Verificar el tipo de contenido de la respuesta
    const contentType = response.headers['content-type'] || '';
    
    // Si es JSON, es un error
    if (contentType.includes('application/json')) {
      const blob = response.data;
      const text = await blob.text();
      let errorMessage = 'Error al generar el Excel';
      
      try {
        const errorData = JSON.parse(text);
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parseando JSON de error:', parseError);
      }
      
      throw new Error(errorMessage);
    } 
    
    // Si es Excel, crear descarga
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Obtener nombre del archivo del header
    const contentDisposition = response.headers['content-disposition'];
    let filename = `solicitud_materiales_${data.codigo_proyecto}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return {
      status: 'success',
      message: 'Excel generado correctamente',
      filename
    };
    
  } catch (error: any) {
    console.error('Error en postEnviarSolicitud:', error);
    
    // Si es un error de respuesta HTTP (como 500)
    if (error.response && error.response.data) {
      const blob = error.response.data;
      const contentType = error.response.headers['content-type'] || '';
      
      if (contentType.includes('application/json')) {
        try {
          const text = await blob.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Error del servidor');
        } catch (parseError) {
          console.error('Error parseando error response:', parseError);
          throw new Error('Error al procesar la respuesta del servidor');
        }
      }
    }
    
    throw error;
  }
};