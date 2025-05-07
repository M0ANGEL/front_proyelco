import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RepRadicacionesPage } from "../pages";

export const RepRadicacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RepRadicacionesPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
