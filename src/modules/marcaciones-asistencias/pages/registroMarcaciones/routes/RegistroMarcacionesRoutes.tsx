import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListRegistroMarcaciones } from "../pages/ListRegistro";



export const RegistroMarcacionesRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListRegistroMarcaciones />} />
        {/* <Route path="/create" element={<FormCategorias />} />
        <Route path="/edit/:id" element={<FormCategorias />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
