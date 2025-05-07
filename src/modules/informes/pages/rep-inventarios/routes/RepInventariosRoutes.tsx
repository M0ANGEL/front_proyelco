import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RepInventariosPage } from "../pages";

export const RepInventariosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RepInventariosPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
