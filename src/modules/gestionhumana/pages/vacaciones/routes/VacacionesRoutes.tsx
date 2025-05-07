import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListVacaciones, FormVacaciones } from "../pages";

export const VacacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListVacaciones />} />
        <Route path="/create" element={<FormVacaciones />} />
        <Route path="/edit/:id" element={<FormVacaciones />} />
      </Route>
    </RoutesWithNotFound>
  );
};
