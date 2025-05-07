/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponseFacturaFVE } from "../types";

export const getListaConsultaDoc = async (
  data: any
): Promise<ResponseFacturaFVE> => {
  let url = "";
  data.data.numero_fve === "" || data.data.numero_fve === undefined
    ? (url = `/listar-documentos-cufe`)
    : (url = `/listar-x-documento-cufe`);
  return await client.post<any>(url, data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const downloadZip = async (data: any): Promise<any> => {
  try {
    const response = await client.post(`images-dispensaciones`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/zip", // Indica que esperas un archivo ZIP en la respuesta
      },
      responseType: "blob", // Configura para recibir una respuesta binaria
    });

    // Crea un blob con los datos binarios de la respuesta
    const blob = new Blob([response.data], { type: "application/zip" });

    // Crea un enlace temporal para descargar el archivo
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "dispensaciones.zip";
    document.body.appendChild(link);

    // Inicia la descarga y elimina el enlace temporal
    link.click();
    document.body.removeChild(link);

    return response; // Puedes devolver la respuesta si es necesario
  } catch (error) {
    console.error("Error al descargar el archivo ZIP", error);
    throw error; // Puedes manejar el error según tus necesidades
  }
};

export const getRPGrafica = async (cufe: string): Promise<any> => {
  return await client.get(`/representacion-grafica/${cufe}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};

export const getRPGraficaLocal = async (
  tipo_doc: string,
  id: string,
  tipoDoc: string
): Promise<any> => {
  return await client.get(`/prefactura/pdf/${id}/${tipo_doc}/${tipoDoc}`, {
    responseType: "arraybuffer",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};
