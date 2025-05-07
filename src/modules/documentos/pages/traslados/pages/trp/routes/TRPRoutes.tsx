import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormTRP, ListTRP } from "../pages";

export const TRPRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTRP />} />
        <Route path="/create" element={<FormTRP />} />
        <Route path="/edit/:id" element={<FormTRP />} />
        <Route path="/show/:id" element={<FormTRP />} />
        <Route path="/anular/:id" element={<FormTRP />} />
      </Route>
    </RoutesWithNotFound>
  );
};
