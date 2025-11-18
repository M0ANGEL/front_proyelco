export interface DashboardStats {
  activos_pendinetes: number;
  proyectosActivos: number;
  proyectosInactivos: number;
  proyectosTerminados: number;
  clientesActivos: number;
  clientesInactivos: number;
}

export interface DashboardResponse {
  status: string;
  data: DashboardStats;
}

export interface DashboardInfo {
  title: string;
  icon: React.ReactNode;
  value: number;
  link: string;
  permiso: boolean;
  bgColor: string;
}