import { UserData } from "@/services/types";
import { Notification } from "../../pages/LoginPage/types";

export interface Props {
  spin: boolean;
  onPushNotification: (data: Notification) => void;
  onChangeLoginStep: (data: number, user: UserData) => void;
  onFetch: (state: boolean) => void;
}
