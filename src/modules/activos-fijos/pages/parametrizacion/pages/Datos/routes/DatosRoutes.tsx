import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListDatos } from "../pages";
import {FormDatos} from "../pages";

export const DatosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDatos />} />
        <Route path="crear-datos" element={<FormDatos/>} />
        <Route path="editar-datos/:id" element={<FormDatos/>} />

        
      </Route>
    </RoutesWithNotFound>
  );
};
