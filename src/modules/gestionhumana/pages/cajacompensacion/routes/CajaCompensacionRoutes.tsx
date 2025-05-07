import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListCajaCompensacion, FormCajaCompensacion } from "../pages";

export const CajaCompensacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCajaCompensacion />} />
        <Route path="/create" element={<FormCajaCompensacion />} />
        <Route path="/edit/:id" element={<FormCajaCompensacion />} />
      </Route>
    </RoutesWithNotFound>
  );
};
