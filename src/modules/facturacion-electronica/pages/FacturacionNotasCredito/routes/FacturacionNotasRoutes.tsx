import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListFacturacionNotas } from "../pages";

export const FacturacionNotasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListFacturacionNotas />} />
      </Route>
    </RoutesWithNotFound>
  );
};
