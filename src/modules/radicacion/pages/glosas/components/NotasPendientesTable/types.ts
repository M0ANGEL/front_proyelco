import { NotaCreditoFVEDisCabecera } from "@/services/types";

export interface Props {
  loader: boolean;
  notasPendientes: NotaCreditoFVEDisCabecera[];
  setNotaCreditoID: (nota_id: string) => void;
}
