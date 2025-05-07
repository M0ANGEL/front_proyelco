import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { MaestroZonasPage } from "../pages";
import { Route } from "react-router-dom";

export const MaestroZonasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<MaestroZonasPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
