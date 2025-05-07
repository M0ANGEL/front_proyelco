import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormEntidades, ListEntidades } from "../pages";

export const EntidadesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListEntidades />} />
        <Route path="/create" element={<FormEntidades />} />
        <Route path="/edit/:id" element={<FormEntidades />} />
      </Route>
    </RoutesWithNotFound>
  );
};
