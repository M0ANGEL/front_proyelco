import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPTE, ListPTE } from "../pages";

export const PTERoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPTE />} />
        <Route path="/create" element={<FormPTE />} />
        <Route path="/edit/:id" element={<FormPTE />} />
        <Route path="/show/:id" element={<FormPTE />} />
        <Route path="/anular/:id" element={<FormPTE />} />
      </Route>
    </RoutesWithNotFound>
  );
};
