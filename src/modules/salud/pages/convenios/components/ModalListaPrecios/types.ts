export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSelectLP: (id: string, descripcion: string) => void;
}
