import { FacturaProveedorCabecera, OrdenCompraDetalle } from "@/services/types";
import { DataType as DataTypeDetalle } from "../../pages/FormFP/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  productosOC: OrdenCompraDetalle[];
  handleSelectProducto: (producto: OrdenCompraDetalle, cantidad_pendiente: number) => void;
  detalle: DataTypeDetalle[];
  facturas?: FacturaProveedorCabecera[];
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  cantidad: string;
  cantidad_ingresada: number;
  cantidad_pendiente: number;
  producto: OrdenCompraDetalle;
}
