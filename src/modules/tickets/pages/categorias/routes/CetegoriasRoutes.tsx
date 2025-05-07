import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListCategorias,FormCategorias} from "../pages";



export const CategoriasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCategorias />} />
        <Route path="/create" element={<FormCategorias />} />
        <Route path="/edit/:id" element={<FormCategorias />} />
      </Route>
    </RoutesWithNotFound>
  );
};
