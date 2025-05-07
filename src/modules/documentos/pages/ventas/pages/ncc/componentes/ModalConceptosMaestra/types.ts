export interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleSelectConcepto: (selctConcepto: string) => void;
}

export interface DataType {
  key: React.Key;
  concepto: string;
}
