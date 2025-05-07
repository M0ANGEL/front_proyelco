import { Producto } from "@/services/types";

export interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    onSetDataSource: (data: DataType[]) => void;
  }
  export interface CamposEstados {
    nombre_campo: string;
    id_campo: string;
    estado: string;
  }
  
  export interface DataType {
    key: React.Key;
    id: number;
    oldId:number;
    cod_padre: string;
    laboratorio:string;
    maxCantidad: number;
    descripcion: string;
    cantidad: number;
    cantidad_retorno:number;
    stock?:number;
    precio_promedio: number;
    lote: string;
    fvence: string;
    iva:number;
    precio_iva: number;
    precio_subtotal: number;
    precio_total: number;
    editable?: boolean;
    editableLote?: boolean;
    editableVen?: boolean;
    itemFromModal: boolean;
  }
  
  export interface SelectedProduct {
    key: React.Key;
    cantidad: number;
  }

  export interface DataTypeModalPadre {
    key: React.Key;
    descripcion: string;
    laboratorio: string;
    cod_padre: string;
    precio_promedio: number;
    precio_compra: number;
    iva: number;
  }
  
  export interface DataTypeModalProductos {
    key: React.Key;
    descripcion: string;
    precio_promedio: number;
    cantidad: number;
    editable: boolean;
    producto: Producto;
  }
  