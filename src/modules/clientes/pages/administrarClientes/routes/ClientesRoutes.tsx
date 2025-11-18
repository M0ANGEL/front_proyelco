import { AuthGuard, RoutesWithNotFound } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormClientes, ListClientes} from "../pages";



export const ClientesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListClientes />} />
        <Route path="/create" element={<FormClientes />} />
        <Route path="/edit/:id" element={<FormClientes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
