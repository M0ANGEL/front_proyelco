import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListHorariosTemporales } from "../pages/ListHorariosTemporales";
import { FormHorariosTemporales } from "../pages/FormHorariosTemporales";

export const HorariosTemporalesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListHorariosTemporales />} />
        <Route path="/create" element={<FormHorariosTemporales />} />
        <Route path="/edit/:id" element={<FormHorariosTemporales />} />
      </Route>
    </RoutesWithNotFound>
  );
};
