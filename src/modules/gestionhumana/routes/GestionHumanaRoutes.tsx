import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { 
  GestionHumanaPage, 
  EmpleadosRoutes, 
  PensionesRoutes, 
  CesantiasRoutes,
  CajaCompensacionRoutes,
  RiesgoArlRoutes,
  BancosRoutes,
  IncapacidadesRoutes,
  AusentismosRoutes,
  ReportIngresosRoutes,
  ProcesosDisciplinariosRoutes,
  PreseleccionesRoutes,
  TerminarContratosRoutes,
  PorcentajesRoutes,
  EstadisticaIncapacidadesRoutes,
  GenerarContratosRoutes, 
  ReporteIncapacidadesRoutes,
  AlertasContratosRoutes,
  CartasRoutes, 
  ConveniosRoutes,
  ArlsRoutes,
  IpsRoutes,
  VacacionesRoutes,
  ReporteRetirosRoutes,
  IngresoDotacionRoutes,
  DotacionesRoutes,
  EntregaDotacionesRoutes,
  DevolucionDotacionesRoutes,
  ReporteEntregasDotacionesRoutes,
  EmpleadosDotacionesRoutes,
  DocumentosAuditoriaRoutes,
  RetirarCesantiasRoutes,
  ReporteRetirosCesantiasRoutes,
  SalarioMinimoRoutes,
  ReporteVacacionesRoutes
} from "../pages";

export const GestionHumanaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<GestionHumanaPage />} />
        <Route path="/empleados/*" element={<EmpleadosRoutes />} />
        <Route path="/parametrizaciones/pensiones/*" element={<PensionesRoutes />} />
        <Route path="/parametrizaciones/cesantias/*" element={<CesantiasRoutes />} />
        <Route path="/parametrizaciones/cajacompensacion/*" element={<CajaCompensacionRoutes />} />
        <Route path="/parametrizaciones/riesgoarl/*" element={<RiesgoArlRoutes />} />
        <Route path="/parametrizaciones/bancos/*" element={<BancosRoutes />} />
        <Route path="/parametrizaciones/porcentajes/*" element={<PorcentajesRoutes />} />
        <Route path="/parametrizaciones/alertascontratos/*" element={<AlertasContratosRoutes />} />
        <Route path="/parametrizaciones/convenios-rh/*" element={<ConveniosRoutes />} />
        <Route path="/parametrizaciones/arls/*" element={<ArlsRoutes />} />
        <Route path="/parametrizaciones/ips/*" element={<IpsRoutes />} />
        <Route path="/parametrizaciones/documentoauditoria/*" element={<DocumentosAuditoriaRoutes/>} />
        <Route path="/incapacidades/*" element={<IncapacidadesRoutes />} />
        <Route path="/ausentismos/*" element={<AusentismosRoutes />} />
        <Route path="/reportes/ingresos/*" element={<ReportIngresosRoutes />} />
        <Route path="/procesosdisciplinarios/*" element={<ProcesosDisciplinariosRoutes />} />
        <Route path="/preselecciones/*" element={<PreseleccionesRoutes />} />
        <Route path="/contratos/terminar/*" element={<TerminarContratosRoutes />} />
        <Route path="/contratos/crearcontratos/*" element={<GenerarContratosRoutes />} />
        <Route path="/contratos/cartas/*" element={<CartasRoutes />} />
        <Route path="/contratos/retirarcesantias/*" element={<RetirarCesantiasRoutes />} />
        <Route path="/contratos/salariominimo/*" element={<SalarioMinimoRoutes />} />
        <Route path="/estadisticaincapacidades/*" element={<EstadisticaIncapacidadesRoutes />} />
        <Route path="/reportes/incapacidades/*" element={<ReporteIncapacidadesRoutes />} />
        <Route path="/vacaciones/*" element={<VacacionesRoutes />} />
        <Route path="/reportes/retiros/*" element={<ReporteRetirosRoutes />} />
        <Route path="/dotaciones/dotacion/*" element={<DotacionesRoutes />} />
        <Route path="/dotaciones/ingresodotacion/*" element={<IngresoDotacionRoutes />} />
        <Route path="/dotaciones/entregas/*" element={<EntregaDotacionesRoutes />} />
        <Route path="/dotaciones/devoluciones/*" element={<DevolucionDotacionesRoutes/>} />
        <Route path="/dotaciones/reporteentregas/*" element={<ReporteEntregasDotacionesRoutes/>} />
        <Route path="/dotaciones/empleados/*" element={<EmpleadosDotacionesRoutes/>} />
        <Route path="/reportes/retirocesantias/*" element={<ReporteRetirosCesantiasRoutes/>} />
        <Route path="/reportes/vacaciones/*" element={<ReporteVacacionesRoutes/>} />
      </Route>
    </RoutesWithNotFound>
  );
};
