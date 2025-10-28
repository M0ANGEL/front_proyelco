import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListaActividadesProyecto } from "../ListaActividadesProyecto";
import { ListCelsiaDocumento } from "../ListCelsiaDocumento";

export const CelsiaRoute = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCelsiaDocumento />} />
        {/* Ruta sin parámetro si usas state */}
        <Route path="/actividades" element={<ListaActividadesProyecto />} />
      </Route>
    </RoutesWithNotFound>
  );
};