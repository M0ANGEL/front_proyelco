import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPersonal, ListPersonal } from "../pages";

export const PersonalRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPersonal />} />
        <Route path="/create" element={<FormPersonal />} />
        <Route path="/edit/:id" element={<FormPersonal />} />
      </Route>
    </RoutesWithNotFound>
  );
};
