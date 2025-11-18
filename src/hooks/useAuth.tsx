// src/hooks/useAuth.tsx
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authService } from "../services/auth.service";
import { encryptionService } from "../services/encryption.service";
import { User, LoginRequest } from "../types/auth.types";
import { KEY_ROL, KEY_ENCRYPTED_USER_DATA } from "../config/api";

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔐 Función para guardar userData cifrado
  const saveEncryptedUserData = async (userData: User) => {
    try {
      const encryptedData = await encryptionService.encrypt(userData);
      localStorage.setItem(KEY_ENCRYPTED_USER_DATA, encryptedData);
    } catch (error) {
      console.error('❌ Error cifrando userData:', error);
    }
  };

  // 🔓 Función para recuperar userData descifrado
  const getDecryptedUserData = async (): Promise<User | null> => {
    try {
      const encryptedData = localStorage.getItem(KEY_ENCRYPTED_USER_DATA);
      if (!encryptedData) {
        return null;
      }

      // Verificar si está cifrado
      if (!encryptionService.isEncrypted(encryptedData)) {
        localStorage.removeItem(KEY_ENCRYPTED_USER_DATA);
        return null;
      }

      const userData = await encryptionService.decrypt(encryptedData);
      return userData;
    } catch (error) {
      console.error('❌ Error descifrando userData:', error);
      // Limpiar datos corruptos
      localStorage.removeItem(KEY_ENCRYPTED_USER_DATA);
      return null;
    }
  };

  const checkAuth = async () => {
    try {
      // 1. Intentar recuperar userData cifrado del localStorage
      const userData = await getDecryptedUserData();
      
      if (userData) {
        setUser(userData);
        setIsLoading(false);
        return;
      }

      // 2. Si no hay en storage pero hay token, obtener del servidor
      if (authService.isAuthenticated()) {
        const freshUserData = await authService.getProfile();
        setUser(freshUserData);
        // Guardar cifrado en localStorage
        await saveEncryptedUserData(freshUserData);
      } else {
        console.log('🚫 AuthProvider: No hay token de autenticación');
      }
    } catch (error) {
      console.error("❌ AuthProvider: Error checking auth:", error);
      authService.clearTokens();
      localStorage.removeItem(KEY_ENCRYPTED_USER_DATA);
      localStorage.removeItem(KEY_ROL);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      
      const response = await authService.login(credentials);
      
      authService.setTokens(response.token);

      // Obtener perfil del usuario
      const userData = await authService.getProfile();
      
      setUser(userData);

      // Guardar datos COMPLETOS cifrados en localStorage
      localStorage.setItem(KEY_ROL, userData.rol);
      await saveEncryptedUserData(userData);

      
    } catch (error) {
      console.error("❌ AuthProvider: Login error:", error);
      // Limpiar en caso de error
      localStorage.removeItem(KEY_ENCRYPTED_USER_DATA);
      localStorage.removeItem(KEY_ROL);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("❌ AuthProvider: Logout error:", error);
    } finally {
      authService.clearTokens();
      // Limpiar todo el localStorage relacionado
      localStorage.removeItem(KEY_ROL);
      localStorage.removeItem(KEY_ENCRYPTED_USER_DATA);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};