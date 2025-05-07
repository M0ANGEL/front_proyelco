import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormCuotas, ListCuotas } from "../pages";

export const CuotasModeradorasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCuotas />} />
        <Route path="/create" element={<FormCuotas />} />
        <Route path="/edit/:id" element={<FormCuotas />} />
        <Route path="/show/:id" element={<FormCuotas />} />
      </Route>
    </RoutesWithNotFound>
  );
};
