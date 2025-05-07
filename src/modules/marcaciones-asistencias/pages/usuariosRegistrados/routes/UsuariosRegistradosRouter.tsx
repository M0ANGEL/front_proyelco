import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { UsuariosRegistrados } from "../pages";




export const UsuariosRegistradosRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<UsuariosRegistrados />} />
      </Route>
    </RoutesWithNotFound>
  );
};
