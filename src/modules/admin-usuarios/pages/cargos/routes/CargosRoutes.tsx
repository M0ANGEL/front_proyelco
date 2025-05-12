import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormCargos, ListCargos } from "../pages";

export const CargosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCargos />} />
        <Route path="/create" element={<FormCargos />} />
        <Route path="/edit/:id" element={<FormCargos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
