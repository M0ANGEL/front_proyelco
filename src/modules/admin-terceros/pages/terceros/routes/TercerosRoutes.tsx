import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListTerceros, FormTerceros } from "../pages";

export const TercerosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTerceros />} />
        <Route path="/create" element={<FormTerceros />} />
        <Route path="/edit/:id" element={<FormTerceros />} />
      </Route>
    </RoutesWithNotFound>
  );
};
