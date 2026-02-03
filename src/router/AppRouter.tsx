import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@/modules/common/guards";
import MainLayout from "../components/layout/MainLayout";

import { AdminUsuariosRoutes } from "@/modules/admin-usuarios";
import { RoutesWithNotFound } from "@/modules/common/guards/NotFound/RoutesWithNotFound";
import { ConfigSisRoutes } from "@/modules/config-sistema";
import { AdministrarProyectoRouter } from "@/modules/proyectos";
import LoadingAnimation from "@/components/ui/LoadingAnimation";
import { AdministrarClientesRoutes } from "@/modules/clientes";
import { AdministrarProcesosProyectoRoutes } from "@/modules/procesosObra";
import { TalentoHumanoRoutes } from "@/modules/talento-humano";
import { ActivosRoutes } from "@/modules/activos-fijos";
import { LogisticaAdminRouter } from "@/modules/logistica/routes";
import { InformePowerBiRouter } from "@/modules/powerBI";
import { MaterialesRoutes } from "@/modules/materiales";
import { DocumentacionRoutes } from "@/modules/documentacion/routes";
import { ContabilidadRoutes } from "@/modules/contabilidad";
import NotFoundPage from "@/modules/common/guards/NotFound/NotFoundPage";

// Lazy load
const Login = React.lazy(() => import("../modules/auth/pages/Login"));
const Dashboard = React.lazy(() => import("../modules/dashboard/pages/Dashboard"));
const Profile = React.lazy(() => import("../modules/profile/pages/Profile"));
const ChangePassword = React.lazy(() => import("../modules/auth/pages/ChangePassword"));
const Settings = React.lazy(() => import("../modules/settings/pages/Settings"));

const LoadingScreen = () => (
  <>
    <div style={{ padding: "50px", textAlign: "center" }}>Cargando...</div>
    <div style={{ marginTop: "70px", textAlign: "center" }}>
      <LoadingAnimation width={300} height={250} />
    </div>
  </>
);

const AppRouter: React.FC = () => {
  return (
    <React.Suspense fallback={<LoadingScreen />}>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/404" element={<NotFoundPage />} />

        {/* Rutas privadas */}
        <Route element={<AuthGuard />}>
          <Route
            path="/*"
            element={
              <MainLayout>
                <RoutesWithNotFound>

                  {/* Rutas básicas */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="change-password" element={<ChangePassword />} />
                  <Route path="settings" element={<Settings />} />

                  {/* Módulos */}
                  <Route path="administraciondeusuarios/*" element={<AdminUsuariosRoutes />} />
                  <Route path="configuraciondelsistema/*" element={<ConfigSisRoutes />} />
                  <Route path="proyectos/*" element={<AdministrarProyectoRouter />} />
                  <Route path="clientes/*" element={<AdministrarClientesRoutes />} />
                  <Route path="configuracionproyectos/*" element={<AdministrarProcesosProyectoRoutes />} />
                  <Route path="talentohumano/*" element={<TalentoHumanoRoutes />} />
                  <Route path="activosfijos/*" element={<ActivosRoutes />} />
                  <Route path="logistica/*" element={<LogisticaAdminRouter />} />
                  <Route path="informes/*" element={<InformePowerBiRouter />} />
                  <Route path="solicitudmaterial/*" element={<MaterialesRoutes />} />
                  <Route path="tramites/*" element={<DocumentacionRoutes />} />
                  <Route path="contabilidad/*" element={<ContabilidadRoutes />} />
                  <Route path="calidad/*" element={<ContabilidadRoutes />} />

                  {/* Ruta por defecto */}
                  <Route index element={<Navigate to="/dashboard" replace />} />

                </RoutesWithNotFound>
              </MainLayout>
            }
          />
        </Route>

      </Routes>
    </React.Suspense>
  );
};

export default AppRouter;
