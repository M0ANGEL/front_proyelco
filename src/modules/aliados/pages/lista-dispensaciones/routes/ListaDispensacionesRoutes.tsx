import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListDispensaciones } from "../pages";

export const ListaDispensacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDispensaciones />} />
      </Route>
    </RoutesWithNotFound>
  );
};
