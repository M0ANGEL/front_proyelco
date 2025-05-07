import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListParametros_SubCategoria } from "../pages";
import {FormParametros_SubCategoria} from "../pages";

export const Parametros_SubCategoriaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListParametros_SubCategoria />} />
        <Route path="crear-parametro-sub-categoria" element={<FormParametros_SubCategoria/>} />
        <Route path="editar-parametro-sub-categoria/:id" element={<FormParametros_SubCategoria/>} />

        
      </Route>
    </RoutesWithNotFound>
  );
};
