import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListFAL } from "../pages";
import { FormDocuments } from "@/modules/common/components/FormDocuments";


export const FALRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListFAL />} />
        <Route path="/create" element={<FormDocuments />} />
        <Route path="/edit/:id" element={<FormDocuments />} />
        <Route path="/show/:id" element={<FormDocuments />} />
        <Route path="/anular/:id" element={<FormDocuments />} />
      </Route>
    </RoutesWithNotFound>
  );
};
