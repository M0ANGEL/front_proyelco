import api from './api';
import { LoginRequest, LoginResponse, ProfileResponse, User } from '../types/auth.types';
import { API_ENDPOINTS } from '@/config/api';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    this.clearTokens();
  },

  async getProfile(): Promise<User> {
    const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
    const profileData: ProfileResponse = response.data;
    return profileData.userData;
  },

  setTokens(token: string): void {
    localStorage.setItem('auth_token', token);
  },

  clearTokens(): void {
    localStorage.removeItem('auth_token');
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  
};
