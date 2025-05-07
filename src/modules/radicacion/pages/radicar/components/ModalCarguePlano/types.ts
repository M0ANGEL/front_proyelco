/* eslint-disable @typescript-eslint/no-explicit-any */
import { IconType } from "antd/es/notification/interface";
import { DataType } from "../../pages/ListRadicacion/types";
import { FacturaFVECabecera } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data_formulario: any;
  setDetalle: (items: DataType[]) => void;
  setFacturas: (items: Item[]) => void;
}

export interface ResponsePlano {
  status: IconType;
  message: string;
  errores: Errores[];
  items: Item[];
}

export interface Errores {
  columna: string;
  fila: number;
  message: string;
}

export interface Item {
  factura: string;
  fecha_radicado: string;
  numero_radicado: string;
  cuenta_radicado: string;
  factura_info: FacturaFVECabecera;
  factura_info_consecutivo?: string;
  factura_info_convenio?: string;
  factura_info_total?: string;
}
