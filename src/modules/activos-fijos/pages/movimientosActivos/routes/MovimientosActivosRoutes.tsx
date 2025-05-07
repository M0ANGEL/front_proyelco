import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {MenuMovimientosActivos } from "../pages";
import { ListMovimientosEquiposComputo } from "../pages/ListMovimientosEquiposComputo";
import { ListMovimientosAmeceres } from "../pages/ListMovimientosAmeceres";
import { ListMovimientosVehiculos } from "../pages/ListMovimientosVehiculos";
import { ListMovimientosPropiedades } from "../pages/ListMovimientosPropiedades";
import { ListMovimientosEquiposIndustrial } from "../pages/ListMovimientosEquiposIndustrial";

export const MovimientosActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={< MenuMovimientosActivos/>} />
        <Route path="MAEC" element={<ListMovimientosEquiposComputo/>} />
        <Route path="MAA" element={<ListMovimientosAmeceres/>} />
        <Route path="MAV" element={<ListMovimientosVehiculos/>} />
        <Route path="MAP" element={<ListMovimientosPropiedades/>} />
        <Route path="MAEI" element={<ListMovimientosEquiposIndustrial/>} />


      </Route>
    </RoutesWithNotFound>
  );
};
