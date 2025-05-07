import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormUsuarios, ListUsuarios } from "..";

export const UsuariosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListUsuarios />} />
        <Route path="/create" element={<FormUsuarios />} />
        <Route path="/edit/:id" element={<FormUsuarios />} />
      </Route>
    </RoutesWithNotFound>
  );
};
