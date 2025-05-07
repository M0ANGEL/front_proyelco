import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ReporteLogHorarios } from "../pages";




export const ReporteLogHorariosRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ReporteLogHorarios />} />
      </Route>
    </RoutesWithNotFound>
  );
};
