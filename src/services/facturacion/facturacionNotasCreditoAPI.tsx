/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../client";
import { ResponsNotasCredito, ResponseNotasCreditoFacturaE } from "../types";

export const getListaFacturaNotas = async (data:any): Promise<ResponseNotasCreditoFacturaE> => {
  let url="";
  data.data.numero_nota === "" || data.data.numero_nota ===undefined ?
    url=`/listar-ncs`: url= `/listar-ncs-doc`;
  return await client.post<any>(
      url,data,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
  };

  export const generacionCufe = async (data:any): Promise<any> => {
      return await client.post<any>(
        `/facturar-notas`,data,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    };

    export const getRPGrafica = async (
      id: string,
      fact: string,
      tipoDoc:string
    ): Promise<any> => {
      console.log( id,fact,tipoDoc);
      return await client.get(`/prefactura/pdf/${id}/${fact}/${tipoDoc}`, {
        responseType: "arraybuffer",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
    };



