import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { encryptionService } from "@/services/encryption.service";
import { KEY_ENCRYPTED_USER_DATA } from "@/config/api";

/* ------------------------------------ */
/* DESCIFRAR USUARIO DE LOCALSTORAGE     */
/* ------------------------------------ */
const getDecryptedUserData = async () => {
  try {
    const encryptedData = localStorage.getItem(KEY_ENCRYPTED_USER_DATA);

    if (!encryptedData) return null;

    const userData = await encryptionService.decrypt(encryptedData);

    return userData || null;
  } catch (error) {
    console.error("Error descifrando userData:", error);
    localStorage.removeItem(KEY_ENCRYPTED_USER_DATA);
    return null;
  }
};

/* ------------------------------------ */
/* RUTAS PERMITIDAS SEGÚN MÓDULOS        */
/* ------------------------------------ */
const buildAllowedRoutes = (user) => {
  const routes = [
    "/dashboard",
    "/profile",
    "/change-password",
    "/settings",
  ];

  const perfil = user?.perfiles?.[0];
  if (!perfil?.modulos) return routes;

  perfil.modulos.forEach((mod) => {
    const moduloPath =
      "/" + (mod.modulo?.nom_modulo || "").toLowerCase().replace(/\s+/g, "");

    const menuPath = mod.menu?.link_menu
      ? "/" + mod.menu.link_menu.toLowerCase()
      : "";

    const submenuPath = mod.submenu?.link_submenu
      ? "/" + mod.submenu.link_submenu.toLowerCase()
      : "";

    if (moduloPath && moduloPath !== "/") routes.push(moduloPath);

    if (moduloPath && menuPath) routes.push(moduloPath + menuPath);

    if (moduloPath && menuPath && submenuPath) {
      routes.push(moduloPath + menuPath + submenuPath);
    }
  });

  return [...new Set(routes)];
};

/* ------------------------------------ */
/* VALIDACIÓN JERÁRQUICA EXACTA          */
/* ------------------------------------ */
const hasHierarchicalPermission = (currentPath, allowedRoutes) => {
  const segments = currentPath.split("/").filter(Boolean);

  if (segments.length === 0) return true;

  for (let i = 0; i < segments.length; i++) {
    const pathToCheck = "/" + segments.slice(0, i + 1).join("/");

    if (allowedRoutes.includes(pathToCheck)) continue;

    const parentPath = "/" + segments.slice(0, i).join("/");

    if (allowedRoutes.includes(parentPath)) return true;

    return false;
  }

  return true;
};

/* ------------------------------------ */
/* PANTALLA DE CARGA                     */
/* ------------------------------------ */
const LoadingScreen = () => (
  <>
    <div style={{ padding: 50, textAlign: "center" }}>Verificando acceso...</div>
    <div style={{ marginTop: 70, textAlign: "center" }}>
      <LoadingAnimation width={300} height={250} />
    </div>
  </>
);

/* ==================================== */
/*             AUTH GUARD               */
/* ==================================== */
export const AuthGuard = () => {
  const { user: contextUser, isAuthenticated, isLoading, setUser } = useAuth();
  const location = useLocation();
  const [finalUser, setFinalUser] = useState(null);
  const [hasAccess, setHasAccess] = useState(null);

  useEffect(() => {
    const validate = async () => {
      setHasAccess(null);

      if (isLoading) return;

      const localUserExists = Boolean(
        localStorage.getItem(KEY_ENCRYPTED_USER_DATA)
      );

      // ➜ Si NO hay usuario en contexto y tampoco en localstorage → login
      if (!contextUser && !localUserExists) {
        setHasAccess(false);
        return;
      }

      let user = contextUser;

      // ➜ Si NO hay usuario en contexto pero SÍ en localstorage → descifrarlo
      if (!contextUser && localUserExists) {
        user = await getDecryptedUserData();
        if (user) setUser(user);
      }

      if (!user) {
        setHasAccess(false);
        return;
      }

      setFinalUser(user);

      const currentPath = location.pathname.toLowerCase();

      // Rutas siempre permitidas
      const alwaysAllowed = ["/", "/dashboard", "/profile", "/change-password", "/settings", "/404"];
      if (alwaysAllowed.includes(currentPath)) {
        setHasAccess(true);
        return;
      }

      const allowedRoutes = buildAllowedRoutes(user);

      const allowed = hasHierarchicalPermission(currentPath, allowedRoutes);

      setHasAccess(allowed);
    };

    validate();
  }, [location.pathname, isLoading, isAuthenticated, contextUser]);

  /* -------- LOADING -------- */
  if (isLoading || hasAccess === null) return <LoadingScreen />;

  /* -------- LOGIN -------- */
  if (!finalUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /* -------- SIN PERMISOS -------- */
  if (!hasAccess) return <Navigate to="/404" replace />;

  /* -------- PERMITIDO -------- */
  return <Outlet />;
};
