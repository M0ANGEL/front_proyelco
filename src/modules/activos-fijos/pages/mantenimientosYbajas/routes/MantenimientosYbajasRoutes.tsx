import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { MantenimienotYbajasPages } from "../pages/MantenimientosPages";
import { BajaActivosRoutes, Mantenimientoactivos } from "../pages";



export const MantenimientosYbajasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<MantenimienotYbajasPages />} />
        <Route path="/mantenimientos/*" element={<Mantenimientoactivos />} />
        <Route path="/activos-baja/*" element={<BajaActivosRoutes />} />

      </Route>
    </RoutesWithNotFound>
  );
};
