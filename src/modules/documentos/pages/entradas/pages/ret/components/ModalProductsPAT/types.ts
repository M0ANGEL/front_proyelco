import { IDocumentosDetalle } from "@/services/types";
import { DataType as DataTypeDetalle } from "../../pages/FormFP/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  productosPAT: IDocumentosDetalle[];
  handleSelectProducto: (producto: IDocumentosDetalle) => void;
  detalle: DataTypeDetalle[];
  pendRetorno: number;
}

export interface DataType {
  key: React.Key;
  descripcion: string;
  cantidad: string;
  producto: IDocumentosDetalle;
}
