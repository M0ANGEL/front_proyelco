import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {
  AperturaRoutes,
  PeriodosPage
} from "../pages";

export const PeriodosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<PeriodosPage />} />
        <Route path="/apertura-cierre-mantenimiento/*" element={<AperturaRoutes />} />

      </Route>
    </RoutesWithNotFound>
  );
};
