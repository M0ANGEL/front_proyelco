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
  refreshAuth: () => Promise<void>;
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

  // 🧹 Función para limpiar datos de autenticación almacenados
  const clearStoredAuthData = (): void => {
    localStorage.removeItem(KEY_ENCRYPTED_USER_DATA);
    localStorage.removeItem(KEY_ROL);
    localStorage.removeItem('encryption_key');
  };

  // 🔐 Función para guardar userData cifrado
  const saveEncryptedUserData = async (userData: User): Promise<void> => {
    try {
      const encryptedData = encryptionService.encrypt(userData);
      localStorage.setItem(KEY_ENCRYPTED_USER_DATA, encryptedData);
    } catch (error) {
      console.error('❌ Error encrypting userData:', error);
      // En caso de error de encriptación, guardar sin cifrar (solo para desarrollo)
      if (import.meta.env.DEV) {
        localStorage.setItem(KEY_ENCRYPTED_USER_DATA, JSON.stringify(userData));
      } else {
        throw error;
      }
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
      if (encryptionService.isEncrypted(encryptedData)) {
        const userData = encryptionService.decrypt(encryptedData);
        return userData;
      } else {
        // Si no está cifrado, migrar a formato cifrado
        const userData = JSON.parse(encryptedData);
        await saveEncryptedUserData(userData);
        localStorage.removeItem(KEY_ENCRYPTED_USER_DATA); // Remover versión sin cifrar
        return userData;
      }
    } catch (error) {
      
      // Intentar recuperar datos sin cifrado (solo para desarrollo)
      if (import.meta.env.DEV) {
        try {
          const fallbackData = localStorage.getItem(KEY_ENCRYPTED_USER_DATA);
          if (fallbackData) {
            const userData = JSON.parse(fallbackData);
            return userData;
          }
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
        }
      }
      
      // Limpiar datos corruptos
      clearStoredAuthData();
      return null;
    }
  };

  // 🔍 Verificar autenticación
  const checkAuth = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // 1. Verificar si hay token
      if (!authService.isAuthenticated()) {
        clearStoredAuthData();
        setIsLoading(false);
        return;
      }

      // 2. Intentar recuperar userData cifrado del localStorage
      const userData = await getDecryptedUserData();
      
      if (userData) {
        setUser(userData);
        setIsLoading(false);
        return;
      }

      // 3. Si no hay en storage pero hay token, obtener del servidor
      const freshUserData = await authService.getProfile();
      setUser(freshUserData);
      
      // Guardar cifrado en localStorage
      await saveEncryptedUserData(freshUserData);
      localStorage.setItem(KEY_ROL, freshUserData.rol);
      

    } catch (error) {
      console.error("❌ AuthProvider: Error checking auth:", error);
      
      // En caso de error, limpiar todo
      authService.clearTokens();
      clearStoredAuthData();
      
      // Regenerar clave de encriptación si es necesario
      if (error instanceof Error && error.message.includes('Encryption')) {
        encryptionService.regenerateKey();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // 🔄 Función para refrescar autenticación
  const refreshAuth = async (): Promise<void> => {
    await checkAuth();
  };

  // 🔑 Login
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setIsLoading(true);
      
      const response = await authService.login(credentials);
      authService.setTokens(response.token);

      // Obtener perfil del usuario
      const userData = await authService.getProfile();
      setUser(userData);

      // Guardar datos cifrados en localStorage
      localStorage.setItem(KEY_ROL, userData.rol);
      await saveEncryptedUserData(userData);


    } catch (error) {
      console.error("❌ AuthProvider: Login error:", error);
      
      // Limpiar en caso de error
      authService.clearTokens();
      clearStoredAuthData();
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 🚪 Logout - CORREGIDO (sin 'this')
  const logout = async (): Promise<void> => {
    try {
      // Intentar logout en el servidor
      await authService.logout();
    } catch (error) {
      console.error("❌ AuthProvider: Logout error:", error);
    } finally {
      // Siempre limpiar datos locales
      authService.clearTokens();
      clearStoredAuthData();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};