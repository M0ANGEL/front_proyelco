import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormFichasObra, ListFichasObra } from "../pages";

export const FichasObraRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="" element={<ListFichasObra />} />
        <Route path="create" element={<FormFichasObra />} />
        <Route path="edit/:id" element={<FormFichasObra />} />
      </Route>
    </RoutesWithNotFound>
  );
};
