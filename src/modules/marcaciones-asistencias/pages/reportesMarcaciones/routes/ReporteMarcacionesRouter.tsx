import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ReporteMarcaciones } from "../pages";




export const ReporteMarcacionesRouter = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ReporteMarcaciones />} />
      </Route>
    </RoutesWithNotFound>
  );
};
