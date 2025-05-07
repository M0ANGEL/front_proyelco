import { DashboardRoutes } from "@/modules/dashboard/routes/DashboardRoutes";
import { GestionEmpresasRoutes } from "@/modules/gestion-empresas";
import { RoutesWithNotFound } from "@/modules/common/components";
import { AdminUsuariosRoutes } from "@/modules/admin-usuarios";
import { AdminTercerosRoutes } from "@/modules/admin-terceros";
import { AdminBodegasRoutes } from "@/modules/admin-bodegas";
import { ConfigSisRoutes } from "@/modules/config-sistema";
import { LogSistemaRoutes } from "@/modules/logs-sistema";
import { DashboardLayout } from "@/modules/common/layout";
import { AliadosRoutes } from "@/modules/aliados";
import { SaludRoutes } from "@/modules/salud";
import { Route } from "react-router-dom";
import { GestionHumanaRoutes } from "@/modules/gestionhumana";
import { TickestRoutes } from "@/modules/tickets";
import { GlobalProvider } from "./GlobalContext";
import { MarcacionAsistenciasRoutes } from "@/modules/marcaciones-asistencias/routes/MarcacionAsistenciaRoutes";
import { AdministrarClientesRoutes } from "@/modules/clientes/routes";

export const AdminRoutes = () => {
  return (
    <>
      <GlobalProvider>
        <RoutesWithNotFound>
          <Route path="/" element={<DashboardLayout />}>
            <Route path={"dashboard/*"} element={<DashboardRoutes />} />
            <Route
              path={"gestiondeempresas/*"}
              element={<GestionEmpresasRoutes />}
            />
            <Route
              path={"administraciondeusuarios/*"}
              element={<AdminUsuariosRoutes />}
            />
            <Route
              path={"configuraciondelsistema/*"}
              element={<ConfigSisRoutes />}
            />
            <Route
              path={"administraciondebodegas/*"}
              element={<AdminBodegasRoutes />}
            />
            <Route path={"proyectos/*"} element={<SaludRoutes />} />
            <Route path={"terceros/*"} element={<AdminTercerosRoutes />} />
            <Route path={"logsdelsistema/*"} element={<LogSistemaRoutes />} />
            <Route path={"clientes/*"} element={<AdministrarClientesRoutes />} />
        
            <Route path={"aliados/*"} element={<AliadosRoutes />} />

            <Route path={"gestionhumana/*"} element={<GestionHumanaRoutes />} />
            <Route path={"tickets/*"} element={<TickestRoutes />} />
            <Route path={"marcaciones/*"} element={<MarcacionAsistenciasRoutes />} />
          </Route>
        </RoutesWithNotFound>
      </GlobalProvider>
    </>
  );
};
