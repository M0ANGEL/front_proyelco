import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormSubmenu, ListSubmenu } from "../pages";

export const SubmenuRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSubmenu />} />
        <Route path="/create" element={<FormSubmenu />} />
        <Route path="/edit/:id" element={<FormSubmenu />} />
      </Route>
    </RoutesWithNotFound>
  );
};
