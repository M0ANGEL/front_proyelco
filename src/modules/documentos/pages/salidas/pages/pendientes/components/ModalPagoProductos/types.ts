import { Convenio, IDispensacion, Producto } from "@/services/types";
import React from "react";
import { DataTypePago } from "../../pages/FormPend/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  productos: DataTypeProductosPend[];
  pendiente_id?: string;
  convenio?: Convenio;
  detalle: DataTypePago[];
  handleSetDetalle: (value: DataTypeLote[]) => void;
  dispensacionesPagadas?: IDispensacion[];
}

export interface DataTypeProductosPend {
  id: string;
  key: React.Key;
  descripcion: string;
  producto_id: string;
  cantidad: number;
  producto: Producto;
  cantidad_pagada: number;
  cantidad_saldo: number;
  cod_padre: string;
  editablePrecio: boolean;
  dias_tratamiento: number;
}

export interface DataTypeLote {
  key: React.Key;
  id: string;
  cod_padre: string;
  desc_producto: string;
  stock: number;
  lote: string;
  fecha_vencimiento: string;
  cantidad: number;
  precio_lista: number;
  precio_promedio: number;
  iva: number;
  fecha_invima: string;
  detalle_id: string;
  dias_tratamiento: number;
}
