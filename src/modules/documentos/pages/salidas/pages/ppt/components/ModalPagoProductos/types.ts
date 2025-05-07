import { DocumentosCabeceraEntradas, Producto } from "@/services/types";
import React from "react";
import { DataType } from "../../pages/FormPPT/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  detalle: DataType[];
  handleSetDetalle: (value: DataTypeLote[]) => void;
  documento_vinculado?: DocumentosCabeceraEntradas;
}

export interface DataTypeProductosPend {
  id: string;
  key: React.Key;
  descripcion: string;
  producto_id: string;
  cantidad: number;
  producto: Producto;
  lote: string;
  fecha_vencimiento: string;
  cantidad_pagada: number;
  cantidad_saldo: number;
  cod_padre: string;
  editablePrecio: boolean;
}

export interface DataTypeLote {
  key: React.Key;
  producto_id: string;
  cod_padre: string;
  desc_producto: string;
  stock: number;
  lote: string;
  fecha_vencimiento: string;
  cantidad: number;
  precio_promedio: number;
  iva: number;
  fecha_invima: string;
  detalle_id: string;
  estado_invima: string;
}
