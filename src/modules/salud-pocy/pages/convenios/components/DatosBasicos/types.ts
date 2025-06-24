import { Tercero } from "@/services/types";
import { SelectProps } from "antd";

export interface Props {
  selectTipoConvenio: SelectProps["options"];
  selectCoberturaPlan: SelectProps["options"];
  selectTipoConsulta: SelectProps["options"];
  selectModalidadContratacion: SelectProps["options"];
  selectTipoDispensaciones: SelectProps["options"];
}

export interface Pagination {
  data: Tercero[];
  per_page: number;
  total: number;
}
