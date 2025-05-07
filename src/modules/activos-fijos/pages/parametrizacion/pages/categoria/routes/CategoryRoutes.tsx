import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListCategory } from "../pages";
import {FormCategoria} from "../pages"

export const CategoryRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCategory />} />
        <Route path="editar-categoria/:id" element={<FormCategoria/>} />
        <Route path="crear-categoria" element={<FormCategoria/>}/>
      </Route>
    </RoutesWithNotFound>
  );
};
