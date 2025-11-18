import { useAuth } from "./useAuth";

export const useAdmin = () => {
  const { user } = useAuth();

  const isAdmin =
    user?.rol?.includes("Administrador") ||
    user?.cargo?.includes("Administrador") ||
    user?.perfiles?.some((perfil) =>
      perfil.nom_perfil.includes("Administrador")
    );

  return { isAdmin };
};
