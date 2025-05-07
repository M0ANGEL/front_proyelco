import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormFuentes, ListFuentes } from "../pages";

export const FuentesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListFuentes />} />
        <Route path="/create" element={<FormFuentes />} />
        <Route path="/edit/:id" element={<FormFuentes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
