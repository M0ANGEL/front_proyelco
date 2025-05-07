import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { OpenPlanoLink } from "../pages";

export const PlanoProductosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<OpenPlanoLink />} />
      </Route>
    </RoutesWithNotFound>
  );
};