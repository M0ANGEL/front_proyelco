import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormSalarioMinimo } from "../pages";

export const SalarioMinimoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<FormSalarioMinimo />} />
        {/* <Route path="/create" element={<FormIncapacidades />} />
        <Route path="/edit/:id" element={<FormIncapacidades />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
