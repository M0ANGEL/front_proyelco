import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormDIS, ListDIS } from "../pages";

export const DISRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListDIS />} />
        <Route path="/create" element={<FormDIS />} />
        <Route path="/edit/:id" element={<FormDIS />} />
        <Route path="/show/:id" element={<FormDIS />} />
        <Route path="/anular/:id" element={<FormDIS />} />
        <Route path="/auditar/:id" element={<FormDIS />} />
      </Route>
    </RoutesWithNotFound>
  );
};
