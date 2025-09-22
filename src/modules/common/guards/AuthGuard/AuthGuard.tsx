import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthRoutesList } from "@/modules/auth";
import useToken from "../../hooks/useToken";
import useSessionStorage from "../../hooks/useSessionStorage";
import { KEY_BODEGA, KEY_EMPRESA, KEY_USER } from "@/config/api";
import { UserData } from "@/services/types";
import { notification } from "antd";
import { useEffect, useState } from "react";

// 👉 Lista de TODAS las rutas definidas en tu sistema (AdminRoutes)
const systemRoutes = [
  "/dashboard",
  "/gestiondeempresas",
  "/administraciondeusuarios",
  "/configuraciondelsistema",
  "/proyectos",
  "/terceros",
  "/logsdelsistema",
  "/clientes",
  "/configuracionproyectos",
  "/compras",
  "/cronogramaasistencias",
  "/tickets",
  "/dashboards",
  "/activosfijos",
  // si luego agregas más, lo actualizas aquí 👆
];

export const AuthGuard = () => {
  const { getToken } = useToken();
  const { getSessionVariable } = useSessionStorage();
  const location = useLocation();

  const token = getToken();
  const empresaId = getSessionVariable(KEY_EMPRESA);
  const bodegaId = getSessionVariable(KEY_BODEGA);
  const userData: UserData = JSON.parse(getSessionVariable(KEY_USER) || "null");

  const [isAuthorized, setIsAuthorized] = useState(true);

  // 1️⃣ Validar autenticación básica
  if (!token || !empresaId || !bodegaId) {
    return (
      <Navigate
        replace
        to={`/${AuthRoutesList.AUTH}/${AuthRoutesList.LOGIN}`}
      />
    );
  }

  // 2️⃣ Validar rutas permitidas
  useEffect(() => {
    if (!userData) return;

    const perfil = userData.perfiles.find(
      (p) => Number(p.id_empresa) === Number(empresaId)
    );
    if (!perfil || !perfil.menu) return;

    // Recolectar todos los paths PERMITIDOS del perfil
    const allowedRoutes: string[] = [];

    const collectRoutes = (items: any[]) => {
      items.forEach((item) => {
        allowedRoutes.push("/" + item.key.toLowerCase());
        if (item.children) collectRoutes(item.children);
      });
    };
    collectRoutes(perfil.menu);

    const currentPath = location.pathname.toLowerCase();
    const currentBase = "/" + (currentPath.split("/")[1] || "");

    // ⬅️ Caso 1: La ruta NO existe en ninguna parte → NotFound
    if (currentPath !== "/dashboard" && !systemRoutes.includes(currentBase)) {
      setIsAuthorized(false);
      return;
    }

    // ⬅️ Caso 2: La ruta existe en el sistema, pero NO en permisos
    const hasPermission = allowedRoutes.some((route) =>
      currentPath.startsWith(route)
    );

    if (currentPath !== "/dashboard" && !hasPermission) {
      notification.warning({
        message: "Acceso denegado",
        description: "No tienes permisos para acceder a este módulo.",
        placement: "topRight",
      });
      setIsAuthorized(false);
    }
  }, [location.pathname]);

  // 3️⃣ Renderizar hijos o NotFound
  if (!isAuthorized) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};
