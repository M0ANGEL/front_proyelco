import { Route } from "react-router-dom";
import { RoutesWithNotFound } from "@/modules/common/components";
import { DashboardPage, PerfilPage } from "../pages";
import { AuthGuard } from "@/modules/common/guards";

export const DashboardRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route index element={<DashboardPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};