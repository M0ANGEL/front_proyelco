import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RepTrasladosPage } from "../pages";

export const RepTrasladosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RepTrasladosPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
