import api from './api';
import { DashboardStats, DashboardResponse } from '../types/dashboard.types';
import { API_ENDPOINTS } from '@/config/api';

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get<DashboardResponse>(API_ENDPOINTS.DASHBOARD.STATS);
      
      if (response.data.status === 'success') {
        return response.data.data;
      } else {
        throw new Error('Error en la respuesta del servidor');
      }
    } catch (error: any) {
      console.error('Error en dashboard service:', error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Error al cargar las estadísticas del dashboard'
      );
    }
  },
};