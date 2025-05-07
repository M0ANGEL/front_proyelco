import {
  FormaFarma,
  GrupoProducto,
  IvaProducto,
  Producto,
  SubGrupoProducto,
} from "@/services/types";

export interface Props {
  producto?: Producto;
  grupos?: GrupoProducto[];
  subgrupos?: SubGrupoProducto[];
  ivas?: IvaProducto[];
  formaFarma?: FormaFarma[];
  upr?:FormaFarma[];
  tipoMedicamento?:FormaFarma[];
}
