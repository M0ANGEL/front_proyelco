import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListPersonalNoProyelco } from "../pages/ListPersonalNoProyelco";
import { FormPersonalNoProyelco } from "../pages/FormPersonalNoProyelco";

export const PersonaNoProyelcolRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="" element={<ListPersonalNoProyelco />} />
        <Route path="create" element={<FormPersonalNoProyelco />} />
        <Route path="edit/:id" element={<FormPersonalNoProyelco />} />
      </Route>
    </RoutesWithNotFound>
  );
};
