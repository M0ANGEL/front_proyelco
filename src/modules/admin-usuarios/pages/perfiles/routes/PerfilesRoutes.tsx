import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPerfiles, ListPerfiles } from "../pages";

export const PerfilesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPerfiles />} />
        <Route path="/create" element={<FormPerfiles />} />
        <Route path="/edit/:id" element={<FormPerfiles />} />
      </Route>
    </RoutesWithNotFound>
  );
};
