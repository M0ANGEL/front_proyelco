import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormBodegaAreas, ListBodegaAreas } from "../pages";


export const BodegaAreasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListBodegaAreas />} />
        <Route path="/create" element={<FormBodegaAreas />} />
        <Route path="/edit/:id" element={<FormBodegaAreas />} />
      </Route>
    </RoutesWithNotFound>
  );
};
