import { Notification } from "@/modules/auth/pages/LoginPage/types";
import { Empresa, TipoDocumento } from "@/services/types";
import { Usuario } from "../../types";
import React from "react";

export interface Props {
  empresas?: Empresa[];
  usuario?: Usuario;
  onPushNotification: (data: Notification) => void;
}

export interface DataTypeSource {
  key: React.Key;
  empresa: string;
  documento: number;
  privilegios: string[];
  empresaInfo?: Empresa;
  documentoInfo?: TipoDocumento;
}
