import { DashboardRoutes } from "@/modules/dashboard/routes/DashboardRoutes";
import { GestionEmpresasRoutes } from "@/modules/gestion-empresas";
import { RoutesWithNotFound } from "@/modules/common/components";
import { AdminUsuariosRoutes } from "@/modules/admin-usuarios";
import { AdminTercerosRoutes } from "@/modules/admin-terceros";
import { ConfigSisRoutes } from "@/modules/config-sistema";
import { LogSistemaRoutes } from "@/modules/logs-sistema";
import { DashboardLayout } from "@/modules/common/layout";
import { SaludRoutes } from "@/modules/salud";
import { Route } from "react-router-dom";
import { GlobalProvider } from "./GlobalContext";
import { AdministrarClientesRoutes } from "@/modules/clientes/routes";
import { AdministrarProcesosProyectoRoutes } from "@/modules/procesosObra/routes";
import { TalentoHumanoRoutes } from "@/modules/talento-humano";
import { ComprasRoutes } from "@/modules/compras";
import { TickestRoutes } from "@/modules/tickets";

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
            <Route path={"proyectos/*"} element={<SaludRoutes />} />
            <Route path={"terceros/*"} element={<AdminTercerosRoutes />} />
            <Route path={"logsdelsistema/*"} element={<LogSistemaRoutes />} />
            <Route
              path={"clientes/*"}
              element={<AdministrarClientesRoutes />}
            />
            <Route
              path={"configuracionproyectos/*"}
              element={<AdministrarProcesosProyectoRoutes />}
            />
             <Route path={"compras/*"} element={<ComprasRoutes />} />
            <Route path={"cronogramaasistencias/*"} element={<TalentoHumanoRoutes />} />
            <Route path={"tickets/*"} element={<TickestRoutes />} />



            {/* <Route path={"aliados/*"} element={<AliadosRoutes />} />

            <Route path={"gestionhumana/*"} element={<GestionHumanaRoutes />} />
            <Route path={"marcaciones/*"} element={<MarcacionAsistenciasRoutes />} /> */}
          </Route>
        </RoutesWithNotFound>
      </GlobalProvider>
    </>
  );
};
