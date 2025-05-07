import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListSubcategorias } from "../pages";
import {FormSubCategoria} from "../pages";

export const SubCategoriaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSubcategorias />} />
        <Route path="crear-subcategoria" element={<FormSubCategoria/>} />
        <Route path="editar-subcategoria/:id" element={<FormSubCategoria/>} />

        
      </Route>
    </RoutesWithNotFound>
  );
};
