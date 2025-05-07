import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  GruposRoutes,
  LaboratoriosRoutes,
  MaestrasProductosPage,
  PadresRoutes,
  ProductosRoutes,
  SubGruposRoutes,
} from "../pages";

export const MaestrasProductosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<MaestrasProductosPage />} />
        <Route path="/maestro/*" element={<ProductosRoutes />} />
        <Route path="/grupos/*" element={<GruposRoutes />} />
        <Route path="/subgrupos/*" element={<SubGruposRoutes />} />
        <Route path="/padres/*" element={<PadresRoutes />} />
        <Route path="/laboratorios/*" element={<LaboratoriosRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
