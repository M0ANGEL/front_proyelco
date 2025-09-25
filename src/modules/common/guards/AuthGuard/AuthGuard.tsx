import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthRoutesList } from "@/modules/auth";
import useToken from "../../hooks/useToken";
import useSessionStorage from "../../hooks/useSessionStorage";
import { KEY_BODEGA, KEY_EMPRESA, KEY_USER } from "@/config/api";
import { UserData } from "@/services/types";
import { notification } from "antd";
import { useEffect, useState } from "react";

// 👉 Lista de rutas base definidas en tu sistema
const systemRoutes = [
  "/dashboard",
  "/dashboard/perfil",
  "/gestiondeempresas",
  "/administraciondeusuarios",
  "/configuraciondelsistema",
  "/proyectos",
  "/terceros",
  "/logsdelsistema",
  "/clientes",
  "/configuracionproyectos",
  "/compras",
  "/talentohumano",
  "/tickets",
  "/dashboards",
  "/activosfijos",
];

// 🔐 Construir rutas jerárquicas desde userData
const buildAllowedRoutes = (perfil: any) => {
  const routes: string[] = [];

  perfil.modulos.forEach((mod: any) => {
    const moduloPath =
      "/" + (mod.modulo?.nom_modulo || "").toLowerCase().replace(/\s+/g, "");

    const menuPath = mod.menu?.link_menu
      ? "/" + mod.menu.link_menu.toLowerCase()
      : "";

    const submenuPath = mod.submenu?.link_submenu
      ? "/" + mod.submenu.link_submenu.toLowerCase()
      : "";

    // Nivel módulo
    if (moduloPath) routes.push(moduloPath);

    // Nivel menú
    if (moduloPath && menuPath) routes.push(moduloPath + menuPath);

    // Nivel submenú
    if (moduloPath && menuPath && submenuPath) {
      routes.push(moduloPath + menuPath + submenuPath);
    }
  });

  return routes;
};

// 🔎 Validar permisos hasta modulo/menu/submenu/*
// Si el usuario tiene permitido un nivel base, cualquier cosa después se permite.
const hasHierarchicalPermission = (
  currentPath: string,
  allowedRoutes: string[]
) => {
  const segments = currentPath.split("/").filter(Boolean); // ["activosfijos","categoria","edit","23"]

  if (segments.length === 0) return true;

  for (let i = 0; i < segments.length; i++) {
    const pathToCheck = "/" + segments.slice(0, i + 1).join("/");

    // Si está en rutas permitidas, seguimos al siguiente segmento
    if (allowedRoutes.includes(pathToCheck)) {
      continue;
    }

    // Si no está en rutas permitidas pero el padre sí lo estaba,
    // entonces dejamos pasar todo lo que venga después
    const basePath = "/" + segments.slice(0, i).join("/");
    if (allowedRoutes.includes(basePath)) {
      return true;
    }

    // Ni este ni el anterior → acceso denegado
    return false;
  }

  return true;
};

export const AuthGuard = () => {
  const { getToken } = useToken();
  const { getSessionVariable } = useSessionStorage();
  const location = useLocation();

  const token = getToken();
  const empresaId = getSessionVariable(KEY_EMPRESA);
  const bodegaId = getSessionVariable(KEY_BODEGA);
  const userData: UserData = JSON.parse(
    getSessionVariable(KEY_USER) || "null"
  );

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
    if (!perfil) return;

    const allowedRoutes = buildAllowedRoutes(perfil);

    const currentPath = location.pathname.toLowerCase();
    const currentBase = "/" + (currentPath.split("/")[1] || "");

    // ✅ Excepción: siempre permitir /dashboard/perfil
    if (currentPath === "/dashboard/perfil") {
      setIsAuthorized(true);
      return;
    }

    // Caso 1: Ruta no existe en sistema
    if (currentPath !== "/dashboard" && !systemRoutes.includes(currentBase)) {
      setIsAuthorized(false);
      return;
    }

    // Caso 2: Ruta existe pero no tengo permisos jerárquicos
    const hasPermission = hasHierarchicalPermission(
      currentPath,
      allowedRoutes
    );

    if (currentPath !== "/dashboard" && !hasPermission) {
      notification.warning({
        message: "Acceso denegado",
        description: "No tienes permisos para acceder a esta información.",
        placement: "topRight",
      });
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [location.pathname]);

  // 3️⃣ Renderizar hijos o NotFound
  if (!isAuthorized) {
    return <Navigate to="/404" replace />;
  }

  return <Outlet />;
};
