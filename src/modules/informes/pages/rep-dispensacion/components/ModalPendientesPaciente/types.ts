import { TypesForm } from "../../pages/RepDispensacionPage/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: TypesForm;
}

export interface DataType {
  key: React.Key;
  apellido_primero: string;
  apellido_segundo: string;
  autorizacion_cabecera: string;
  bod_nombre: string;
  cantidad_saldo: string;
  cantidad_pagada: string;
  cantidad_pendiente: number;
  consecutivo: string;
  created_at: string;
  descripcion: string;
  nombre_primero: string;
  nombre_segundo: string;
  observacion: string;
  producto_id: string;
  estado: string;
}
