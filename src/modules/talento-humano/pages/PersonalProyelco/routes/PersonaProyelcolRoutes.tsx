import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPersonalProyelco, ListPersonalProyelco } from "../pages";

export const PersonaProyelcolRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPersonalProyelco />} />
        <Route path="/create" element={<FormPersonalProyelco />} />
        <Route path="/edit/:id" element={<FormPersonalProyelco />} />
      </Route>
    </RoutesWithNotFound>
  );
};
