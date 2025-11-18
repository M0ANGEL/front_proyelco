import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormMantenimientoactivos, ListMantenimientoactivos } from "../pages";



export const Mantenimientoactivos = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListMantenimientoactivos />} />
        <Route path="/create" element={<FormMantenimientoactivos />} />
        <Route path="/edit/:id" element={<FormMantenimientoactivos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
