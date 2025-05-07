import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListDotaciones, FormDotaciones } from "../pages";

export const DotacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDotaciones />} />
        <Route path="/create" element={<FormDotaciones />} />
        <Route path="/edit/:id" element={<FormDotaciones />} />
      </Route>
    </RoutesWithNotFound>
  );
};
