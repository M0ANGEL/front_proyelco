import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormPPT, ListPPT } from "../pages";

export const PPTRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListPPT />} />
        <Route path="/create/:pte_id" element={<FormPPT />} />
        <Route path="/edit/:id" element={<FormPPT />} />
        <Route path="/show/:id" element={<FormPPT />} />
        <Route path="/anular/:id" element={<FormPPT />} />
      </Route>
    </RoutesWithNotFound>
  );
};
