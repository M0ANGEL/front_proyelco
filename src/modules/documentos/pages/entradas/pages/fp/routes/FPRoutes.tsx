import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormFP, ListFP } from "../pages";

export const FPRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        {/* <Route path="/" element={<DocumentosPage />} /> */}
        <Route path="/" element={<ListFP />} />
        <Route path="/create/:oc_id" element={<FormFP />} />
        <Route path="/edit/:id" element={<FormFP />} />
        <Route path="/show/:id" element={<FormFP />} />
        <Route path="/anular/:id" element={<FormFP />} />
      </Route>
    </RoutesWithNotFound>
  );
};
