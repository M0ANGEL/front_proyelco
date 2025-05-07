import { Notification } from "../../pages/LoginPage/types";

export interface Props {
  spin: boolean;
  onPushNotification: (data: Notification) => void;
  onFetch: (state: boolean) => void;
}
