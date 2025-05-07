import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListSubCategorias,FormSubCategorias} from "../pages";



export const SubCategoriasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSubCategorias />} />
        <Route path="/create" element={<FormSubCategorias />} />
        <Route path="/edit/:id" element={<FormSubCategorias />} />
      </Route>
    </RoutesWithNotFound>
  );
};
