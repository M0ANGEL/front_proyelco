import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListFacturacionConvenios, FormFacturacionConvenios } from "../pages";

export const FacturacionConveniosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListFacturacionConvenios />} />
        <Route path="/create" element={<FormFacturacionConvenios/>}/>
        <Route path="/edit/:id" element={<FormFacturacionConvenios/>}/>
      </Route>
    </RoutesWithNotFound>
  );
};
