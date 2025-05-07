import { DashboardRoutes } from "@/modules/dashboard/routes/DashboardRoutes";
import { GestionInventarioRoutes } from "@/modules/gestiondeinventario";
import { MaestrasProductosRoutes } from "@/modules/maestras-productos";
import { FacturacionERoutes } from "@/modules/facturacion-electronica";
import { GestionAuditoriaRoutes } from "@/modules/gestionauditoria";
import { VencimientoRoutes } from "@/modules/controldevencimientos";
import { GestionEmpresasRoutes } from "@/modules/gestion-empresas";
import { RoutesWithNotFound } from "@/modules/common/components";
import { AdminUsuariosRoutes } from "@/modules/admin-usuarios";
import { AdminTercerosRoutes } from "@/modules/admin-terceros";
import { ListaPreciosRoutes } from "@/modules/listadeprecios";
import { AdminBodegasRoutes } from "@/modules/admin-bodegas";
import { ConfigSisRoutes } from "@/modules/config-sistema";
import { LogSistemaRoutes } from "@/modules/logs-sistema";
import { DashboardLayout } from "@/modules/common/layout";
import { DocumentosRoutes } from "@/modules/documentos";
import { RadicacionRoutes } from "@/modules/radicacion";
import { SyncRoutes } from "@/modules/sincronizacion";
import { InformesRoutes } from "@/modules/informes";
import { PeriodosRoutes } from "@/modules/periodos";
import { AliadosRoutes } from "@/modules/aliados";
import { KardexRoutes } from "@/modules/kardex";
import { SaludRoutes } from "@/modules/salud";
import { Route } from "react-router-dom";
import { DistribucionRoutes } from "@/modules/distribucion";
import { ActivosFijosRoutes } from "@/modules/activos-fijos";
import { GestionHumanaRoutes } from "@/modules/gestionhumana";
import { TickestRoutes } from "@/modules/tickets";
import { GlobalProvider } from "./GlobalContext";
import { MarcacionAsistenciasRoutes } from "@/modules/marcaciones-asistencias/routes/MarcacionAsistenciaRoutes";

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
            <Route path={"salud/*"} element={<SaludRoutes />} />
            <Route path={"listadeprecios/*"} element={<ListaPreciosRoutes />} />
            <Route path={"terceros/*"} element={<AdminTercerosRoutes />} />
            <Route path={"productos/*"} element={<MaestrasProductosRoutes />} />
            <Route path={"documentos/*"} element={<DocumentosRoutes />} />
            <Route path={"reportes/*"} element={<InformesRoutes />} />
            <Route path={"logsdelsistema/*"} element={<LogSistemaRoutes />} />
            <Route
              path={"gestionauditoria/*"}
              element={<GestionAuditoriaRoutes />}
            />
            <Route
              path={"controldevencimientos/*"}
              element={<VencimientoRoutes />}
            />
            <Route
              path={"gestiondeinventario/*"}
              element={<GestionInventarioRoutes />}
            />
            <Route
              path={"facturacionelectronica/*"}
              element={<FacturacionERoutes />}
            />
            <Route path={"radicacion/*"} element={<RadicacionRoutes />} />
            <Route path={"periodos/*"} element={<PeriodosRoutes />} />
            <Route path={"kardex/*"} element={<KardexRoutes />} />
            <Route
              path={"sincronizacioncontabilidad/*"}
              element={<SyncRoutes />}
            />
            <Route path={"aliados/*"} element={<AliadosRoutes />} />
            <Route path={"distribucion/*"} element={<DistribucionRoutes />} />
            <Route path={"activosfijos/*"} element={<ActivosFijosRoutes />} />
            <Route path={"gestionhumana/*"} element={<GestionHumanaRoutes />} />
            <Route path={"tickets/*"} element={<TickestRoutes />} />
            <Route path={"marcaciones/*"} element={<MarcacionAsistenciasRoutes />} />
          </Route>
        </RoutesWithNotFound>
      </GlobalProvider>
    </>
  );
};
