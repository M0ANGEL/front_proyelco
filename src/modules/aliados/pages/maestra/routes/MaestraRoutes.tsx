import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListAliados, FormAliados } from "../pages";

export const MaestraRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAliados />} />
        <Route path="/create" element={<FormAliados />} />
        <Route path="/edit/:id" element={<FormAliados />} />
      </Route>
    </RoutesWithNotFound>
  );
};
