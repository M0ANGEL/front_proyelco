import { Tercero } from "@/services/types";
import { SelectProps } from "antd";

export interface Props {
  usuariosCorreo?: SelectProps["options"];
}

export interface Pagination {
  data: Tercero[];
  per_page: number;
  total: number;
}
