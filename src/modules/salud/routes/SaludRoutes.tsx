import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  ConveniosRoutes,
  SaludPage,
} from "../pages";

export const SaludRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<SaludPage />} />
        <Route path="/administrar-proyectos/*" element={<ConveniosRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
