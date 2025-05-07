/* eslint-disable @typescript-eslint/no-explicit-any */
// subcategoriaAPI.ts
import { User } from "@/modules/admin-usuarios/pages/usuarios/types";
import { clientActivos } from "../client";
import {
  ActivoCompleto,
  Activos,
  Bodega,
  FiltrosActivos,
  ResponseActivoCompleto,
  ResponseActivos,
  ResponseImpuestoRodamiento,
  ResponseListActivos,
  ResponseListActivosPagination,
  ResponseListaLocalizaciones,
  ResponseListaUsuarios,
  ResponseListBajaActivosFijos,
  ResponseMantenimientoAlertas,
  ResponseSoatAlertas,
} from "../types";
import QRCode from "qrcode";

// Obtener lista de activos
export const getListaActivos = async (
): Promise<ResponseListActivos> => {
  const response = await clientActivos.get<{
    data: Activos[];
    status: string;
    total: number;
    per_page: number;
  }>(`activos`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const getListaActivosPagination = async (
  data: any
): Promise<ResponseListActivosPagination> => {
  return await clientActivos.post
  (`activos-pagination`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

// Método para obtener la lista de activos con filtros
export const getListaActivosFiltrados = async (
  filtros: FiltrosActivos
): Promise<ResponseListActivos> => {
  const response = await clientActivos.get<{
    data: Activos[];
    status: string;
    total: number;
    per_page: number;
  }>("activos-filtrados", {
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

// Obtener información de los activos
export const getActivos = async (id: number): Promise<ResponseActivos> => {
  return await clientActivos.get(`activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getActivosFotos = async (id: number): Promise<any> => {
  return await clientActivos.get(`activos-fotos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getActivosXusuario = async (idUsuario: number): Promise<any> => {
  return await clientActivos.get(`activos-usuario/${idUsuario}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getActivosXSubcategoria = async (idSubcategoria: number): Promise<any> => {
  return await clientActivos.get(`activos-subcategoria-filtrados/${idSubcategoria}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


// Crear un nuevo activo
export const crearActivo = async (
  data: FormData,
  user_id: number
): Promise<any> => {
  return await clientActivos.post<any>("activos", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      user_id: user_id.toString(),
    },
  });
};

// Actualizar un activo existente
export const updateActivo = async (
  id: number,
  data: Activos,
  user_id: number
): Promise<any> => {
  return await clientActivos.put<any>(`activos/${id}`, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      user_id: user_id.toString(),
    },
  });
};

// Eliminar un activo
export const deleteActivo = async (
  id: React.Key,
  id_usuario: number
): Promise<any> => {
  return await clientActivos.delete<any>(`activos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      user_id: id_usuario.toString(),
    },
  });
};

export const inactivateActivo = async (id: number, id_usuario: number, observacion: string) => {
  return await clientActivos.put(`activos-inactivar/${id}`, { id_usuario: id_usuario.toString(), observacion }, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



export const getActivosBodega = async (
  localizacion: number 
): Promise<ResponseListActivos> => {
  const response = await clientActivos.get<{
    data: Activos[];
    status: string;
    total: number;
    per_page: number;
  }>(`activos-bodega`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      localizacion: localizacion.toString(), 
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const aceptarBajaActivo = async (
  id: number,
  userId: number
): Promise<ResponseListBajaActivosFijos> => {
  const response = await clientActivos.post<any>(
    `activos-baja/${id}`,
    {
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

export const solicitarHistoricoActivo = async (
  id_activo: number,
): Promise<ResponseActivoCompleto> => {
  const response = await clientActivos.get<{
    data: ActivoCompleto;
    status: string;
  }>(
    `activos-historico/${id_activo}`, // Ruta en el backend
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
  return {
    data: response.data.data,
    status: response.data.status,
  };
};

export const getActivosAlquiler = async (
  estado: number,
  localizacion: number
): Promise<ResponseListActivos> => {
  const response = await clientActivos.get<{
    data: Activos[];
    status: string;
    total: number;
    per_page: number;
  }>(`activos-alquilados`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      estado: estado.toString(), 
      localizacion: localizacion.toString(),
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const generateQr = async (id: number): Promise<void> => {
  const baseURL = clientActivos.defaults.baseURL;

  const qrContent = `${baseURL}activos/pdf/${id}`;

  const qrImageUrl = await QRCode.toDataURL(qrContent);

  const downloadLink = document.createElement("a");
  downloadLink.href = qrImageUrl;
  downloadLink.download = `activo_${id}_qr_code.png`;

  document.body.appendChild(downloadLink);
  downloadLink.click();

  document.body.removeChild(downloadLink);
};

export const getAlertasMantenimientos =
  async (): Promise<ResponseMantenimientoAlertas> => {
    return await clientActivos.get("activos-alerta-mantenimiento", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getAlertasSoat = async (): Promise<ResponseSoatAlertas> => {
  return await clientActivos.get("activos-alerta-soat", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getAlertasTechno = async (): Promise<ResponseSoatAlertas> => {
  return await clientActivos.get("activos-alerta-tecno", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getAlertasImpuestoRodamiento =
  async (): Promise<ResponseImpuestoRodamiento> => {
    return await clientActivos.get("activos-alerta-impuesto-rodamiento", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

export const getAdjuntosActivos = async (id: number): Promise<any> => {
  return await clientActivos.get<any>(`activos-adjuntos/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      id: id,
    },
  });
};

export const getActivosSinImagenes = async (): Promise<any> => {
  return await clientActivos.get<number[]>('activos-sin-imagenes', {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  }).then(response => response.data);
};


export const descargarAdjuntos = async (
  id: number,
  nombreArchivo: string,
  carpeta: string
): Promise<any> => {
  return await clientActivos.get<any>(`activo-descargar-adjuntos/${id}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      id: id,
      nombreArchivo: nombreArchivo, // Añade el nombre del archivo a los parámetros
      carpeta: carpeta,
    },
  });
};

// Método para eliminar un archivo de un mantenimiento
export const eliminarAdjunto = async (
  id: number,
  nombreArchivo: string,
  carpeta: string
): Promise<any> => {
  return await clientActivos.delete(`eliminar-archivo-activo/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      id: id,
      nombreArchivo: nombreArchivo,
      carpeta: carpeta,
    },
  });
};

export const cargarAdjuntos = async (
  data: FormData,
  id: number
): Promise<any> => {
  return await clientActivos.post<any>(`cargar-adjuntos/${id}`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const crearActivosMasivos = async (data: FormData): Promise<any> => {
  7;
  return await clientActivos.post<any>(`cargar-activos-masivo`, data, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getBodegasLocalizaciones =
  async (): Promise<ResponseListaLocalizaciones> => {
    const response = await clientActivos.get<{
      data: Bodega[];
      status: string;
      total: number; // Si tu backend devuelve un total, inclúyelo
      per_page: number;
    }>("bodegas", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    return {
      data: response.data.data,
      status: response.data.status,
      total: response.data.total,
      per_page: response.data.per_page,
    };
  };

export const getUsuariosLista = async (): Promise<ResponseListaUsuarios> => {
  const response = await clientActivos.get<{
    data: User[];
    status: string;
    total: number; // Si tu backend devuelve un total, inclúyelo
    per_page: number;
  }>("usuarios", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const updateLocalizacion = async (
  id: number,
  localizacion: number,
  usuarios: number,
  userId: number
): Promise<any> => {
  return await clientActivos.put(
    `actualizar-Movimientos-activos/${id}`,
    {
      localizacion,
      usuarios,
      userId
    },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
};

export const getActivosBodegaEstadoPropiedad = async (
  localizacion: number,
  estado: number,
  estado_propiedad: number
): Promise<ResponseListActivos> => {
  const response = await clientActivos.get<{
    data: Activos[];
    status: string;
    total: number;
    per_page: number;
  }>(`activos-bodega-estado-propiedad`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      localizacion: localizacion.toString(), // Asegúrate de que 'idBodegaOrigen' sea una cadena
      estado: estado.toString(),
      estado_propiedad: estado_propiedad.toString(),
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const getActivosBodegaEstado = async (
  localizacion: number,
  estado: number
): Promise<ResponseListActivos> => {
  const response = await clientActivos.get<{
    data: Activos[];
    status: string;
    total: number;
    per_page: number;
  }>(`activos-bodega-estado`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    params: {
      localizacion: localizacion.toString(), // Asegúrate de que 'idBodegaOrigen' sea una cadena
      estado: estado.toString(),
    },
  });

  return {
    data: response.data.data,
    status: response.data.status,
    total: response.data.total,
    per_page: response.data.per_page,
  };
};

export const getActivosConDatos = async (id: number) => {
  return await clientActivos.get(`activos-datos/${id}`);
};
