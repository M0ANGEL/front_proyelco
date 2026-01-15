import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RecepcionMaterialAsignadoList } from "../pages";


export const RecepcionMaterialAsignadoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RecepcionMaterialAsignadoList />} />

      </Route>
    </RoutesWithNotFound>
  );
};
