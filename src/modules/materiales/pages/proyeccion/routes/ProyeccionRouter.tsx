import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { Proyeccion } from "../pages";
import { ShowProyeccion } from "../pages/ShowProyeccion";


export const ProyeccionRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<Proyeccion />} />
        <Route path="/showproyeccion/:codigo_proyecto" element={<ShowProyeccion />} />
      </Route>
    </RoutesWithNotFound>
  );
};
