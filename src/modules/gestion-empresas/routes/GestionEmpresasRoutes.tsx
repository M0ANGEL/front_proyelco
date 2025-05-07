import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { EmpresasRoutes, GestionEmpresasPage } from "../pages";

export const GestionEmpresasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<GestionEmpresasPage />} />
        <Route path="/empresas/*" element={<EmpresasRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
