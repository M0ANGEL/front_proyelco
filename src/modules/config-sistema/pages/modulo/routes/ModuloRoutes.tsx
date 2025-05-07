import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormModulo, ListModulo } from "../pages";

export const ModuloRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListModulo />} />
        <Route path="/create" element={<FormModulo />} />
        <Route path="/edit/:id" element={<FormModulo />} />
      </Route>
    </RoutesWithNotFound>
  );
};
