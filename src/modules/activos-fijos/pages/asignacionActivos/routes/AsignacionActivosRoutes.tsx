import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListAsignacionActivosPendientes  } from "../pages";

export const AsignacionActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAsignacionActivosPendientes/>} />

      </Route>
    </RoutesWithNotFound>
  );
};
