import { client } from "../client";
import { ResponseBlob } from "../types";

export const getLogUsuarios = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`users/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogEmpresas = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`empresas/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogBodegas = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`bodegas/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogPerfiles = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`perfiles/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogPerfilXUsu = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`userperfiles/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogProductos = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`productos/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogProductoLotes = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`productolotes/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogTerceros = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`terceros/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogUserSessions = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`user/session/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogTrEntradas = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`trentradas/detalles/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogTrSalidas = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`trsalidas/detalles/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogCuotasModeradoras = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`cuotasmoderadoras/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogPacientes = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`pacientes/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogConvenios = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`convenios/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
export const getLogsMotivosAUD = async (
  startDate: string,
  endDate: string
): Promise<ResponseBlob> => {
  return await client.get(`motivos-aud/logs/export/${startDate}/${endDate}`, {
    responseType: "blob",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
