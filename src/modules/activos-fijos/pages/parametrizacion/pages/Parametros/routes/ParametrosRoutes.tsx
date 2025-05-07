import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListParametros } from "../pages";
import {FormParametros} from "../pages";

export const ParametrosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListParametros />} />
        <Route path="crear-parametro" element={<FormParametros/>} />
        <Route path="editar-parametro/:id" element={<FormParametros/>} />

        
      </Route>
    </RoutesWithNotFound>
  );
};
