import { client } from "../client";
import { Convenio, ResponseListaFacturaFVE, ResponseSearchConvenios } from "../types";

  export const getConvenios = async (): Promise<ResponseSearchConvenios> => {
    return await client.get<{ data: Convenio[]; status: string }>(
      "rips/get-convenios",
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  }; 

  export const getListRips = async (data:any): Promise<ResponseListaFacturaFVE> => {
    return await client.post("listar-rips",data ,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const downJson = async (data: any): Promise<any> => {
    
    // data[0].mod_contrato==='CP'? url=`generar-rips/capita` : url=`generar-rips`;
    const rutas = [
      { key: "CP", url: "generar-rips/capita" },
      { key: "FEV", url: "generar-rips" },
      { key: "NCT", url: "rips/notacredito" },
      { key: "NA", url: "generar-rips" },
      { key: "NACP", url: "generar-rips/capita" }


  ];
  const url=rutas.find(ruta => ruta.key === data[0].mod_contrato)?.url ?? '';
  
    try {
      const response = await client.post(url, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: 'application/zip', // Indica que esperas un archivo ZIP en la respuesta
        },
        responseType: 'arraybuffer', // Configura para recibir una respuesta binaria
      });
  
      // Crea un blob con los datos binarios de la respuesta
      const blob = new Blob([response.data], { type: 'application/zip' });
  
      // Crea un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Rips.zip';
      document.body.appendChild(link);
  
      // Inicia la descarga y elimina el enlace temporal
      link.click();
      document.body.removeChild(link);
  
      return response; // Puedes devolver la respuesta si es necesario
    } catch (error) {
      console.error('Error al descargar el archivo ZIP', error);
      throw error; // Puedes manejar el error según tus necesidades
    }
  };

  export const dockerRips = async (data:any): Promise<any> => {
    let url;
    data[0].mod_contrato==='CP'? url=`generar-rips/capita` : url=`generar-rips`;
    return await client.post(url,data ,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };

  export const getListzip = async (data:any): Promise<ResponseListaFacturaFVE> => {
    return await client.post("listar-facturas",data ,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  };
  export const downZip = async (data: any): Promise<any> => {
 
    try {
      const response = await client.post('procesar-facturas', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: 'application/zip', // Indica que esperas un archivo ZIP en la respuesta
        },
        responseType: 'arraybuffer', // Configura para recibir una respuesta binaria
      });
  
      // Crea un blob con los datos binarios de la respuesta
      const blob = new Blob([response.data], { type: 'application/zip' });
  
      // Crea un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'Radicacion.zip';
      document.body.appendChild(link);
  
      // Inicia la descarga y elimina el enlace temporal
      link.click();
      document.body.removeChild(link);
  
      return response; // Puedes devolver la respuesta si es necesario
    } catch (error) {
      console.error('Error al descargar el archivo ZIP', error);
      throw error; // Puedes manejar el error según tus necesidades
    }

    
  };

  export const getFvc = async (data:any): Promise<any> => {
    return await client.post("rips/listFvc",data ,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  }; 

  export const getCuv = async (data:any): Promise<any> => {
    return await client.post("rips/getCuv",data ,{
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
  }; 
  export const descargarTxt = async (data: any): Promise<Blob> => {
    const response = await client.post("rips/descargar-txt", data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}`,},
      responseType: "blob",
    });
    return response.data;
  };

export const statusApi = async (): Promise<any> => {
  return await client.get<{status: string }>(
    "rips/statusApi",
    {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }
  );
}; 
  
