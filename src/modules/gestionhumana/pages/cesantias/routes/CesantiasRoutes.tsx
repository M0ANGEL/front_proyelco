import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListCesantias, FormCesantias } from "../pages";
// import {  } from "../pages/FormCesantias";

export const CesantiasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCesantias />} />
        <Route path="/create" element={<FormCesantias />} />
        <Route path="/edit/:id" element={<FormCesantias />} />
      </Route>
    </RoutesWithNotFound>
  );
};
