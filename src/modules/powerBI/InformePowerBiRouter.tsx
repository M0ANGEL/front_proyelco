import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";


import { InformePoryectos, InformeUnidadMedidas } from "@/modules/powerBI";

export const InformePowerBiRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/informes-poryectos" element={<InformePoryectos />} />
        <Route path="/informe-unidad-vivienda" element={<InformeUnidadMedidas/>} />
      </Route>
    </RoutesWithNotFound>
  );
};
