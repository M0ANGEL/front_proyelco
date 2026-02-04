import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { RecepcionMaterialList } from "../pages";


export const RecepcionMaterialRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<RecepcionMaterialList />} />

      </Route>
    </RoutesWithNotFound>
  );
};
