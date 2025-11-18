
import { Route } from "react-router-dom";
import { FormUsuarios, ListUsuarios } from "..";
import { RoutesWithNotFound } from "@/modules/common/guards/NotFound/RoutesWithNotFound";
import { AuthGuard } from "@/modules/common/guards";

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
