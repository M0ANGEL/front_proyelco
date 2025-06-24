import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListProveedores } from "../pages/ListProveedores";
import { FormProveedores } from "../pages/FormProveedores";

export const ProveedoresRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListProveedores />} />
        <Route path="/create" element={<FormProveedores />} />
        <Route path="/edit/:id" element={<FormProveedores />} />
      </Route>
    </RoutesWithNotFound>
  );
};
