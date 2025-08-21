import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";

import { ActivosPages } from "../pages/ActivosPage";
import { CategoriasActivosRoutes } from "../pages/categoriasActivos";
import { CrearActivosRoutes, MisActivosRoutes, SubCategoriasActivosRoutes } from "../pages";
import { BodegaAreasRoutes } from "../pages/bodegasAreas";
import { TransladosActivosRoutes } from "../pages/traslados";
import { KardexActivosRoutes } from "../pages/kardexActivos/routes/KardexActivosRoutes";

export const ActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ActivosPages />} />
        <Route path="/parametrizacion/categorias/*" element={<CategoriasActivosRoutes />} />
        <Route path="/parametrizacion/subcategorias/*" element={<SubCategoriasActivosRoutes />} />
        <Route path="/crear-activos/*" element={<CrearActivosRoutes />} />
        <Route path="/parametrizacion/bodegas-areas/*" element={<BodegaAreasRoutes />} />
        <Route path="/mis-activos/*" element={<MisActivosRoutes />} />
        <Route path="/traslados-activos/*" element={<TransladosActivosRoutes />} />
        <Route path="/kardex-activos/*" element={<KardexActivosRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
