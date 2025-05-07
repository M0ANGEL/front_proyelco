import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { DistComprasRoutes, DistribucionPage } from "../pages";

export const DistribucionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<DistribucionPage />} />
        <Route path="/compras/*" element={<DistComprasRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
