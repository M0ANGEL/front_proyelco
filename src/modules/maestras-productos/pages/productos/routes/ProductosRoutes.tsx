import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListProductos, FormProductos } from "../pages";

export const ProductosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListProductos />} />
        <Route path="/create" element={<FormProductos />} />
        <Route path="/edit/:id" element={<FormProductos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
