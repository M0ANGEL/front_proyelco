import React from "react";

export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface DataType {
  key: React.Key;
  producto_id: string;
  descripcion: string;
  cod_padre: string;
  detalle_id: string;
  lote: string;
  fecha_vencimiento: string;
  cantidad: number;
  iva: number;
  precio_promedio: number;
  precio_subtotal: number;
  precio_iva: number;
  precio_total: number;
  itemFromModal: boolean;
}
