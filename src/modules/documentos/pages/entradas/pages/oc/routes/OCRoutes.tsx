import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormOC, ListOC } from "../pages";

export const OCRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListOC />} />
        <Route path="/create/:rqp_id" element={<FormOC />} />
        <Route path="/edit/:id" element={<FormOC />} />
        <Route path="/show/:id" element={<FormOC />} />
        <Route path="/anular/:id" element={<FormOC />} />
      </Route>
    </RoutesWithNotFound>
  );
};
