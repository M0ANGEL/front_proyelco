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
import { DashboarsdRoutes } from "@/modules/graficasDashboard/routes/DashboarsdRoutes";
import { ActivosRoutes } from "@/modules/activos-fijos";
import { LogisticaAdminRouter } from "@/modules/logistica/routes";
import { MaterialesRoutes } from "@/modules/materiales";
import { DocumentacionRoutes } from "@/modules/documentacion/routes";
import { InformePowerBiRouter } from "@/modules/powerBI";

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
            <Route
              path={"talentohumano/*"}
              element={<TalentoHumanoRoutes />}
            />
            <Route path={"tickets/*"} element={<TickestRoutes />} />
            <Route path={"dashboards/*"} element={<DashboarsdRoutes />} />

            <Route path={"activosfijos/*"} element={<ActivosRoutes />} />

            <Route path={"logistica/*"} element={<LogisticaAdminRouter />} />
            <Route path={"soliciudmaterial/*"} element={<MaterialesRoutes />} />
            <Route path={"documentacion/*"} element={<DocumentacionRoutes />} />
            <Route path={"informes/*"} element={<InformePowerBiRouter />} />
            {/* <Route path={"marcaciones/*"} element={<MarcacionAsistenciasRoutes />} /> */}
          </Route>
        </RoutesWithNotFound>
      </GlobalProvider>
    </>
  );
};
