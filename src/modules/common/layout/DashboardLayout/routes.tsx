import { Route } from "react-router-dom";
import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { DashboardLayout } from ".";

export const DashboardLayoutRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route index element={<DashboardLayout />} />
      </Route>
    </RoutesWithNotFound>
  );
};