import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormTRE, ListTRE } from "../pages";

export const TRERoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTRE />} />
        <Route path="/create" element={<FormTRE />} />
        <Route path="/edit/:id" element={<FormTRE />} />
        <Route path="/show/:id" element={<FormTRE />} />
        <Route path="/anular/:id" element={<FormTRE />} />
      </Route>
    </RoutesWithNotFound>
  );
};
