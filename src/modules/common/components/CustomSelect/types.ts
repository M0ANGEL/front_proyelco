/* eslint-disable @typescript-eslint/no-explicit-any */
import { SelectProps } from "antd";
import { FieldError } from "react-hook-form";

export interface Props {
  options: SelectProps["options"];
  error?: FieldError | undefined;
  placeholder: string;
  mode?: "multiple" | "tags";
  disabled?: boolean;
  value?:
    | string
    | number
    | string[]
    | number[]
    | { label: string; value: string }
    | { label: string; value: string }[];
  defaultValue?:
    | string
    | number
    | string[]
    | number[]
    | { label: string; value: string }
    | { label: string; value: string }[];
  onChange?: (value: any) => void;
  style?: React.CSSProperties | undefined;
  maxTagCount?: number
  listHeight?: number
}
