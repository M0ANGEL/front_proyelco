import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormMisActivos } from "../pages";
import { VistaTap } from "../pages/ListMisActivos";


export const MisActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<VistaTap />} />
        <Route path="/create" element={<FormMisActivos />} />
        <Route path="/edit/:id" element={<FormMisActivos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
