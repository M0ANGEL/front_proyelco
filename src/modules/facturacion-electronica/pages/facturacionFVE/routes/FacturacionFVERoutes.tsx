import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListFacturacionFVE } from "../pages";

export const FacturacionFVERoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListFacturacionFVE />} />
      </Route>
    </RoutesWithNotFound>
  );
};
