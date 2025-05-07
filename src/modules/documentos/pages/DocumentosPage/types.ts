/* eslint-disable @typescript-eslint/no-explicit-any */
import { Privilegios } from "@/services/types";

export interface UserDocumentos {
  id: number;
  codigo: string;
  descripcion: string;
  id_empresa: string;
  id_grupo: string;
  privilegios?: Privilegios;
  estado: string;
}

export interface GrupoDocumentos {
  desc: string;
  documentos?: UserDocumentos[];
}
