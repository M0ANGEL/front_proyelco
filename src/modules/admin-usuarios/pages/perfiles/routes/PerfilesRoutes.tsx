import { Route } from "react-router-dom";
import { FormPerfiles, ListPerfiles } from "../pages";
import { RoutesWithNotFound } from "@/modules/common/guards/NotFound/RoutesWithNotFound";
import { AuthGuard } from "@/modules/common/guards";

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
