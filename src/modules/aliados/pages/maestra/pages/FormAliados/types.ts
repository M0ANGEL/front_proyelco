import { AlertasPlano, ErroresPlano } from "@/services/types";

export interface ResponsePlanoProductos {
  status: string;
  message: string;
  errores: ErroresPlano[];
  alertas: AlertasPlano[];
  items: ProductosAliados[];
}

export interface ProductosAliados {
  codigo_producto_aliado: string;
  codigo_producto_sebthi: string;
  descripcion_sebthi: string;
  tarifa: number;
}
