import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListVEA} from "../pages";
import { FormDocuments } from "@/modules/common/components/FormDocuments";




export const VEARoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListVEA />} />
        <Route path="/create" element={<FormDocuments />} />
        <Route path="/edit/:id" element={<FormDocuments />} />
        <Route path="/show/:id" element={<FormDocuments />} />
        <Route path="/anular/:id" element={<FormDocuments />} />
      </Route>
    </RoutesWithNotFound>
  );
};
