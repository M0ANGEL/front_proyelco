import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {  ListKardexConsolidado } from "../pages";

export const KardexConsolidadoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListKardexConsolidado />} />
      </Route>
    </RoutesWithNotFound>
  );
};
