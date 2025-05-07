import { DocumentosCabecera } from "@/services/types";

export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  documentos: DocumentosCabecera[];
}
