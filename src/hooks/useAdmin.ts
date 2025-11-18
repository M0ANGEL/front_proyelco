// src/hooks/useAdmin.ts
import { useAuth } from "./useAuth";

// Definir los roles que se consideran administradores
const ADMIN_ROLES = [
  'Administrador'
  // 'Administrador TI', 
  // 'Super Administrador',
  // 'Admin',
  // 'SuperAdmin'
];

export const useAdmin = () => {
  const { user, isAuthenticated } = useAuth();

  // ✅ Verificación de roles administrativos (exactos)
  const isAdmin = Boolean(
    user?.rol && 
    (
      // Caso 1: Rol está en la lista de ADMIN_ROLES
      ADMIN_ROLES.includes(user.rol) ||
      // Caso 2: Rol es array que contiene algún rol administrativo
      (Array.isArray(user.rol) && user.rol.some(role => 
        role && ADMIN_ROLES.includes(role)
      ))
    )
  );

  const hasAdminAccess = isAuthenticated && isAdmin;

  return { 
    isAdmin, 
    hasAdminAccess,
    userRole: user?.rol,
    adminRoles: ADMIN_ROLES
  };
};