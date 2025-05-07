import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListRiesgoArl, FormRiesgoArl } from "../pages";

export const RiesgoArlRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListRiesgoArl />} />
        <Route path="/create" element={<FormRiesgoArl />} />
        <Route path="/edit/:id" element={<FormRiesgoArl />} />
      </Route>
    </RoutesWithNotFound>
  );
};
