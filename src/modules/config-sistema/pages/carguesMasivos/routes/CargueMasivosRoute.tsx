import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListCargueEmpleados } from "../cargueEmpleados/pages";
import { CargieUpdateObrasFaltantes } from "../cargieUpdateObrasFaltantes";

export const CargueMasivosRoute = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/cargue-empleados" element={<ListCargueEmpleados />} />
        <Route path="/cargue-update-proyectos" element={<CargieUpdateObrasFaltantes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
