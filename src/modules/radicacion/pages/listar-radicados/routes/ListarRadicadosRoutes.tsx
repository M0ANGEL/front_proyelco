import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListarRadicados, FormRadicados } from "../pages";

export const ListarRadicadosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListarRadicados />} />
        <Route path="/show/:id" element={<FormRadicados />} />
      </Route>
    </RoutesWithNotFound>
  );
};
