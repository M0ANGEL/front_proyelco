// SimpleNotification.tsx
import { notification } from "antd";
import type { NotificationPlacement } from "antd/es/notification/interface";

export const notify = {
  success: (message: string, description?: string, placement: NotificationPlacement = "bottomRight") => {
    notification.success({ message, description, placement, duration: 3 });
  },
  error: (message: string, description?: string, placement: NotificationPlacement = "bottomRight") => {
    notification.error({ message, description, placement, duration: 3 });
  },
  info: (message: string, description?: string, placement: NotificationPlacement = "bottomRight") => {
    notification.info({ message, description, placement, duration: 3 });
  },
  warning: (message: string, description?: string, placement: NotificationPlacement = "bottomRight") => {
    notification.warning({ message, description, placement, duration: 3 });
  },
};


export interface Notification {
  title?: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
}

type NotificationType = "success" | "info" | "warning" | "error";