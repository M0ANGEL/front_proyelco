import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListPorcentajes, FormPorcentajes } from "../pages";

export const PorcentajesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPorcentajes />} />
        <Route path="/create" element={<FormPorcentajes />} />
        <Route path="/edit/:id" element={<FormPorcentajes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
