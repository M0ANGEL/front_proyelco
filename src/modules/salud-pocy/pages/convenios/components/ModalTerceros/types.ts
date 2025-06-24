export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSelectTercero: (nit: string, razon_soc: string) => void;
}
