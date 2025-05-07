import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListPensiones, FormPensiones } from "../pages";

export const PensionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPensiones />} />
        <Route path="/create" element={<FormPensiones />} />
        <Route path="/edit/:id" element={<FormPensiones />} />
      </Route>
    </RoutesWithNotFound>
  );
};
