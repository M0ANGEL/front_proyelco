import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListRetirarCesantias, FormRetirarCesantias  } from "../pages";

export const RetirarCesantiasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListRetirarCesantias />} />
        <Route path="/create" element={<FormRetirarCesantias />} />
        <Route path="/edit/:id" element={<FormRetirarCesantias />} />
      </Route>
    </RoutesWithNotFound>
  );
};
