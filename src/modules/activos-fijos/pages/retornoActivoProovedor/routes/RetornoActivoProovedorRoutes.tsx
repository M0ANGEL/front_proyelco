import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {FormRetornoActivoProovedor, ListRetornoActivoProovedor} from "../pages";
import { FormRetornoActivoProovedorMasivo } from "../pages/FormRetornoActivoProvedorMasivo";



export const RetornoActivoProovedoresRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListRetornoActivoProovedor />} />
        <Route path="crear-retorno-activo-proovedor" element={<FormRetornoActivoProovedor/>} />
        <Route path="crear-retorno-activo-proovedor-masivos" element={<FormRetornoActivoProovedorMasivo/>} />


      </Route>
    </RoutesWithNotFound>
  );
};
