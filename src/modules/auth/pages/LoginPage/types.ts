export interface LoginFormInput {
  username: string;
  password: string;
  empresa: string;
  bodega: string;
}

export interface Notification {
  title?: string;
  description?: string;
  type?: NotificationType;
  duration?: number;
}

type NotificationType = "success" | "info" | "warning" | "error";
