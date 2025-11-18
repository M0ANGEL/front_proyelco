import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";

import { ActivosPages } from "../pages/ActivosPage";
import { CategoriasActivosRoutes } from "../pages/categoriasActivos";
import { CrearActivosRoutes, SubCategoriasActivosRoutes } from "../pages";
import { BodegaAreasRoutes } from "../pages/bodegasAreas";
import { TransladosActivosRoutes } from "../pages/traslados";
import { KardexActivosRoutes } from "../pages/kardexActivos/routes/KardexActivosRoutes";
import { MantenimientosYbajasRoutes } from "../pages/mantenimientosYbajas/routes";

export const ActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ActivosPages />} />
        <Route path="/parametrizacion/categorias/*" element={<CategoriasActivosRoutes />} />
        <Route path="/parametrizacion/subcategorias/*" element={<SubCategoriasActivosRoutes />} />
        <Route path="/administras-activos/*" element={<CrearActivosRoutes />} />
        <Route path="/parametrizacion/bodegas-areas/*" element={<BodegaAreasRoutes />} />
        <Route path="/traslados-activos/*" element={<TransladosActivosRoutes />} />
        <Route path="/historial-activos/*" element={<KardexActivosRoutes />} />
        <Route path="/administrar-mantenimientos/*" element={<MantenimientosYbajasRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
