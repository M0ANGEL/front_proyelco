import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormHorarios, ListHorarios } from "../pages";

export const HorariosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListHorarios />} />
        <Route path="/create" element={<FormHorarios />} />
        <Route path="/edit/:id" element={<FormHorarios />} />
      </Route>
    </RoutesWithNotFound>
  );
};
