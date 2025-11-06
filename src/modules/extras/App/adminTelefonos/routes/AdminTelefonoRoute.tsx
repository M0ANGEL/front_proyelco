import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListTelefonos } from "../pages/ListTelefonos";



export const AdminTelefonoRoute = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListTelefonos />} />
        {/* <Route path="/create" element={<FormCategorias />} />
        <Route path="/edit/:id" element={<FormCategorias />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
