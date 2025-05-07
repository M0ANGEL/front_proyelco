import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormTiposDispensacion, ListTiposDispensacion } from "../pages";

export const TiposDispensacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTiposDispensacion />} />
        <Route path="/create" element={<FormTiposDispensacion />} />
        <Route path="/edit/:id" element={<FormTiposDispensacion />} />
      </Route>
    </RoutesWithNotFound>
  );
};
