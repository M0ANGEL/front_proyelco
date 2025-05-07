import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RepFacturacionPage } from "../pages";

export const RepFacturacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RepFacturacionPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
