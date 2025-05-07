import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListArls, FormArls } from "../pages";

export const ArlsRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListArls />} />
        <Route path="/create" element={<FormArls />} />
        <Route path="/edit/:id" element={<FormArls />} />
      </Route>
    </RoutesWithNotFound>
  );
};
