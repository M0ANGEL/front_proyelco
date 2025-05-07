import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormTRS, ListTRS } from "../pages";
import { FormDistribucionCompra } from "../components";

export const TRSRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTRS />} />
        <Route path="/create" element={<FormTRS />} />
        <Route path="/edit/:id" element={<FormTRS />} />
        <Route path="/show/:id" element={<FormTRS />} />
        <Route path="/anular/:id" element={<FormTRS />} />
        <Route path="/distribuir/:fp_id" element={<FormDistribucionCompra />} />
      </Route>
    </RoutesWithNotFound>
  );
};
