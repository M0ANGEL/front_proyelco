import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListOrganismosDocumento } from "../ListOrganismosDocumento";
import { ListaActividadesOrganismos } from "../ListaActividadesOrganismos";

export const OrganismosRoute = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListOrganismosDocumento />} />
        {/* Ruta sin parámetro si usas state */}
        <Route path="/actividades-organismos" element={<ListaActividadesOrganismos />} />
      </Route>
    </RoutesWithNotFound>
  );
};