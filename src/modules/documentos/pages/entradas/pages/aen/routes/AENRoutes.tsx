import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {ListAEN} from "../pages";
import { FormDocuments } from "@/modules/common/components/FormDocuments";

export const AENRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAEN/>}/>
        <Route path="/create" element={<FormDocuments/>}/>
        <Route path="/edit/:id" element={<FormDocuments />} />
        <Route path="/show/:id" element={<FormDocuments />} />
        <Route path="/anular/:id" element={<FormDocuments />} />
      </Route>
    </RoutesWithNotFound>
  );
};
