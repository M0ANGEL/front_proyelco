import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListGrupos, FormGrupos } from "../pages";

export const GruposRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListGrupos />} />
        <Route path="/create" element={<FormGrupos />} />
        <Route path="/edit/:id" element={<FormGrupos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
