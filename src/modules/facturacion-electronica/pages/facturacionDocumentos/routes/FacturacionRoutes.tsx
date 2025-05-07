import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListFacturacion } from "../pages";

export const FacturacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListFacturacion />} />
      </Route>
    </RoutesWithNotFound>
  );
};
