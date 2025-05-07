import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListMotivos, FormMotivos } from "../pages";

export const MotivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListMotivos />} />
        <Route path="/create" element={<FormMotivos />} />
        <Route path="/edit/:id" element={<FormMotivos />} />
      </Route>
    </RoutesWithNotFound>
  );
};
