import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormMenu, ListMenu } from "../pages";

export const MenuRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListMenu />} />
        <Route path="/create" element={<FormMenu />} />
        <Route path="/edit/:id" element={<FormMenu />} />
      </Route>
    </RoutesWithNotFound>
  );
};
