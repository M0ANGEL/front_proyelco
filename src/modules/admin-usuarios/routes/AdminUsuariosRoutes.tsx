import { Route } from "react-router-dom";
import {
  AdminUsuariosPage,
  CargosRoutes,
  PerfilesRoutes,
  UsuariosRoutes,
} from "../pages";
import { RoutesWithNotFound } from "@/modules/common/guards/NotFound/RoutesWithNotFound";
import { AuthGuard } from "@/modules/common/guards";

export const AdminUsuariosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}> {/* Ahora SÍ usa AuthGuard */}
        <Route path="/" element={<AdminUsuariosPage />} />
        <Route path="/usuarios/*" element={<UsuariosRoutes />} />
        <Route path="/perfiles/*" element={<PerfilesRoutes />} />
        <Route path="/cargos/*" element={<CargosRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};