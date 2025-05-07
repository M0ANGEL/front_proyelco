import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { AdminBodegasPage, BodegasRoutes } from "../pages";

export const AdminBodegasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<AdminBodegasPage />} />
        <Route path="/bodegas/*" element={<BodegasRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
