import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormAUD, ListAUD } from "../pages";

export const AuditoriaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAUD />} />
        <Route path="/create" element={<FormAUD />} />
        <Route path="/edit/:id" element={<FormAUD />} />
        <Route path="/show/:id" element={<FormAUD />} />
        <Route path="/anular/:id" element={<FormAUD />} />
      </Route>
    </RoutesWithNotFound>
  );
};
