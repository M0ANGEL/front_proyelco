import { Bodega, Producto } from "@/services/types";

export interface Props {
  data: DataTypeChildren[];
  // setChildren: (children: DataTypeChildren[]) => void;
  // accion: string;
}

export interface DataTypeChildren {
  // key: React.Key;
  // id: number;
  // lote: string;
  // fecha_vencimiento: string;
  // stock: string;.
  // iva: any;
  // precio_lista: any;
  // id: number;
  // descripcion: string;
  // lote: string;
  // fecha_vencimiento: string;
  // stock: string;
  // precio_promedio: string;
  // precio_lista_precio: string;
  // fecha_vig_invima: string;
  // precio: string;
  // bodega_id: string;
  // producto_id: number;
  // productos: Producto;
  // estado: string;
  // bodegas: Bodega;
  // estado_invima: string;
  lote: string;
  iva: number;
  precio_lista: number;
  descripcion: string;
  precio_promedio: string;
  fecha_vencimiento:string;
}
