import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  AdminUsuariosPage,
  PerfilesRoutes,
  UsuariosRoutes,
  ProcesosRoutes,
} from "../pages";

export const AdminUsuariosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<AdminUsuariosPage />} />
        <Route path="/usuarios/*" element={<UsuariosRoutes />} />
        <Route path="/perfiles/*" element={<PerfilesRoutes />} />
        <Route path="/procesos/*" element={<ProcesosRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
