import { ResponseMaterialesSinco } from "@/types/typesGlobal";
import { client_sinco } from "../client";


export const getInsumosSincoApi = async (): Promise<ResponseMaterialesSinco> => {
  return await client_sinco.get("solicitudes-proyectos");
};