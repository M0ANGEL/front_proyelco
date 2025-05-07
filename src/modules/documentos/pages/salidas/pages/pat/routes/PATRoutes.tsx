import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPAT, ListPAT } from "../pages";

export const PATRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPAT />} />
        <Route path="/create" element={<FormPAT />} />
        <Route path="/edit/:id" element={<FormPAT />} />
        <Route path="/show/:id" element={<FormPAT />} />
        <Route path="/anular/:id" element={<FormPAT />} />
      </Route>
    </RoutesWithNotFound>
  );
};
