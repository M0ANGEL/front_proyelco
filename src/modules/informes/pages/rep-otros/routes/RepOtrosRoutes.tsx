import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RepOtrosPage } from "../pages";

export const RepOtrosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RepOtrosPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
