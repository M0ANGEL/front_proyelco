import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListProd } from "../pages";

export const InventarioRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListProd />} />
        {/* <Route path="/create" element={<FormProd />} />
        <Route path="/edit/:id" element={<FormProd />} />
        <Route path="/show/:id" element={<FormProd />} />
        <Route path="/anular/:id" element={<FormProd />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
