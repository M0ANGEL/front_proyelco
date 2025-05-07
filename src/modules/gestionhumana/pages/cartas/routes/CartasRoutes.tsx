import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormCartas } from "../pages";

export const CartasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<FormCartas />} />
        {/* <Route path="/create" element={<FormCartas />} /> */}
        {/* <Route path="/edit/:id" element={<FormCesantias />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
