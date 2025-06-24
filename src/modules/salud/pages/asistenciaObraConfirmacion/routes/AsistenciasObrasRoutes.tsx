import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {ListAsistenciasObraConfirmacion } from "../pages";

export const AsistenciasObrasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAsistenciasObraConfirmacion />} />
      </Route>
    </RoutesWithNotFound>
  );
};
