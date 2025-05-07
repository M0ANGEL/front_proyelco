import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListIps, FormIps } from "../pages";

export const IpsRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListIps />} />
        <Route path="/create" element={<FormIps />} />
        <Route path="/edit/:id" element={<FormIps />} />
      </Route>
    </RoutesWithNotFound>
  );
};
