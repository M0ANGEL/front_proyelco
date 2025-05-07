import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ActivosFijosPage, InventarioRoutes, MantenimientoRoutes, ParametrizacionRoutes, TransladosActivosRoutes  } from "../pages";
import { VencimientosRoutes } from "../pages/vencimientos/routes/VencimientosRoutes";
import { SolicitarActivosRoutes } from "../pages/solicitarActivos";
import { InformesRoutes } from "../pages/informes";
import { HistoricoRoutes } from "../pages/HistoricoActivos";
import { AsignacionActivosRoutes } from "../pages/asignacionActivos";
import { MovimientosActivosRoutes } from "../pages/movimientosActivos/routes";
import {ActaAsignacionActivoRoutes } from "../pages/ActaAsignacionActivos";

export const ActivosFijosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ActivosFijosPage />} />
        <Route path="parametrizacion/*" element={<ParametrizacionRoutes/>} />
        <Route path="mantenimiento/*" element={<MantenimientoRoutes/>} />
        <Route path="inventario/*" element={<InventarioRoutes/>} />
        <Route path="traslados/*" element={<TransladosActivosRoutes/>} />
        <Route path="vencimientos/*" element={<VencimientosRoutes/>} />
        <Route path="solicitar-activos/*" element={<SolicitarActivosRoutes/>} />
        <Route path="informes/*" element={<InformesRoutes/>} />
        <Route path="historico/*" element={<HistoricoRoutes/>} />
        <Route path="asignacion-activos/*" element={<AsignacionActivosRoutes/>} />
        <Route path="movimientos-activos/*" element={<MovimientosActivosRoutes/>} />
        <Route path="acta-asignacion-activos/*" element={<ActaAsignacionActivoRoutes/>} />









      
      </Route>
    </RoutesWithNotFound>
  );
};
