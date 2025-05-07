import { UserData } from "@/services/types";
import { Notification } from "../../pages/LoginPage/types";

export interface Props {
  user?: UserData;
  onChangeLoginStep: (data: number) => void;
  spin: boolean;
  onFetch: (state: boolean) => void;
  onPushNotification: (data: Notification) => void;
}

export interface SelectOptions {
  empresas?: Array<Options>;
  bodegas?: Array<Options>;
}

export interface Options {
  value: string;
  label: string;
}
