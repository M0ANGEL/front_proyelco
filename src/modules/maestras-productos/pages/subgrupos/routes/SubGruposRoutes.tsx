import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListSubGrupos, FormSubGrupos } from "../pages";

export const SubGruposRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSubGrupos />} />
        <Route path="/create" element={<FormSubGrupos />} />
        <Route path="/edit/:id" element={<FormSubGrupos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
