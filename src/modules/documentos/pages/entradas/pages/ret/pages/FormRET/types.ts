export interface CamposEstados {
  nombre_campo: string;
  id_campo: string;
  estado: string;
}

export interface Props {
  openModalLote: boolean;
  setOpenModalLote: (value: boolean) => void;
  producto_id: React.Key | undefined;
  detalle: DataType[];
  setDetalle: (value: DataType[]) => void;
}

export interface DataType {
  
  key: React.Key;
  desc_padre: string;
  id_padre?: number;
  cantidad: number;
  maxCantidad: number;
  editable: boolean;
}

export interface Pagination {
  data: Convenio[];
  per_page: number;
  total: number;
}


export interface DataTypeDispensaciones {
  key: React.Key;
  consecutivo: string;
  fecha_dispensacion: string;
  desc_producto: string;
  cant_entregada: number;
  cant_saldo: number;
  cant_solicitada: number;
  bodega: string;
}
