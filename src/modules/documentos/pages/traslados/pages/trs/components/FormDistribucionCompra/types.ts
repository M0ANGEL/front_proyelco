export interface TrasladosGenerados {
  key: React.Key;
  consecutivo: string;
  id: number;
  estado_pdf: "wait" | "generating" | "done";
}
