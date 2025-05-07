import { FormObservacionesAud, ListObservacionesAud } from "../pages";
import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";

export const AudObservacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListObservacionesAud />} />
        <Route path="/create" element={<FormObservacionesAud />} />
        <Route path="/edit/:id" element={<FormObservacionesAud />} />
      </Route>
    </RoutesWithNotFound>
  );
};
