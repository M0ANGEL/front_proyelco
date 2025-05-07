import { ReactNode } from "react";

export interface DashboardInfo {
  title: string;
  icon: ReactNode;
  value: number;
  link: string;
  bgColor: string;
  permiso: boolean;
  
}
