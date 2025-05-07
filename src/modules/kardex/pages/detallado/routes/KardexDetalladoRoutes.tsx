import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {  ListKardexDetallado } from "../pages";

export const KardexDetalladoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListKardexDetallado />} />
      </Route>
    </RoutesWithNotFound>
  );
};
