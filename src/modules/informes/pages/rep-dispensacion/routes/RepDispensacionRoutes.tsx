import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RepDispensacionPage } from "../pages";

export const RepDispensacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RepDispensacionPage />} />
      </Route>
    </RoutesWithNotFound>
  );
};
