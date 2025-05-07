import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormSCO, ListSCO } from "../pages";

export const SCORoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSCO />} />
        <Route path="/create" element={<FormSCO />} />
        <Route path="/edit/:id" element={<FormSCO />} />
        <Route path="/show/:id" element={<FormSCO />} />
        <Route path="/anular/:id" element={<FormSCO />} />
      </Route>
    </RoutesWithNotFound>
  );
};
