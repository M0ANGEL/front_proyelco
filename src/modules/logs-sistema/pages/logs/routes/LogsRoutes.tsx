import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { LogsPage } from "../pages";

export const LogsRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<LogsPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
