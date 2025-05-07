import { IDocumentosDetalle } from "@/services/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Props {
  openModalPro: boolean;
  setOpenModalPro: (value: boolean) => void;
  onSetDataSource?: (data: DataType[]) => void;
  handleSelectPadre: (producto: IDocumentosDetalle) => void;
  idProducto: React.Key;
  variableCompartida: number;
  onUpdateLote: any;
  onUpdateFechaVencimiento: any;
}

export interface DataType {
  lote: any;
  id: any;
  key: React.Key;
  descripcion: string;
  fvence: any;
  cantidad: number;
  editable: boolean;
}
