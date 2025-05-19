import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  AdminUsuariosPage,
  PerfilesRoutes,
  UsuariosRoutes,
} from "../pages";
import { CargosRoutes } from "../pages/cargos";

export const AdminUsuariosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<AdminUsuariosPage />} />
        <Route path="/usuarios/*" element={<UsuariosRoutes />} />
        <Route path="/perfiles/*" element={<PerfilesRoutes />} />
        <Route path="/cargos/*" element={<CargosRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
