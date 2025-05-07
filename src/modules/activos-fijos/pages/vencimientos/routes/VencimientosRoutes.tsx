import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListVencimientos } from "../pages";

export const VencimientosRoutes = () => {
  return (
      <RoutesWithNotFound>
        <Route element={<AuthGuard />}>
          <Route path="/" element={<ListVencimientos />} />
        </Route>
      </RoutesWithNotFound>
  );
};
