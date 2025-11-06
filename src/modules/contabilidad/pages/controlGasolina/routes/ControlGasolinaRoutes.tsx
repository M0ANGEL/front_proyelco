import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormControlGasolina, ListControlGasolina } from "../pages";




export const ControlGasolinaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListControlGasolina />} />
        <Route path="/create" element={<FormControlGasolina />} />
      </Route>
    </RoutesWithNotFound>
  );
};
