import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListEmcalDocumento } from "../ListEmcalDocumento";
import { ListaActividadesProyecto } from "../ListaActividadesProyecto";

export const EmcaliRoute = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListEmcalDocumento />} />
        {/* Ruta sin parámetro si usas state */}
        <Route path="/actividades" element={<ListaActividadesProyecto />} />
      </Route>
    </RoutesWithNotFound>
  );
};