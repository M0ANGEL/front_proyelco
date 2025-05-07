import { AudObservacion, MotivosAuditoria } from "@/services/types";

export interface DataType {
  key: React.Key;
  aud_observacion: string;
  motivos: MotivosAuditoria[];
  estado: string;
}

export interface Pagination {
  data: AudObservacion[];
  per_page: number;
  total: number;
}
