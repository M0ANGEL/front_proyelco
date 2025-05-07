import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RepAnuladosPage } from "../pages";

export const RepAnuladosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RepAnuladosPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
