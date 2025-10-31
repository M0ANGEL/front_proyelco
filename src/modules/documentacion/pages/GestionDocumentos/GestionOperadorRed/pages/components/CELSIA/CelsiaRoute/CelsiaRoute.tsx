import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListCelsiaDocumento } from "../ListCelsiaDocumento";
import { ListaActividadesCelsiaProyecto } from "../ListaActividadesCelsiaProyecto";

export const CelsiaRoute = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCelsiaDocumento />} />
        {/* Ruta sin parámetro si usas state */}
        <Route path="/actividades-celsia" element={<ListaActividadesCelsiaProyecto />} />
      </Route>
    </RoutesWithNotFound>
  );
};