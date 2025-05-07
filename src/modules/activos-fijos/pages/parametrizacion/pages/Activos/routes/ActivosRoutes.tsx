import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListActivos,FormActivos} from "../pages";

export const ActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListActivos />} />
        <Route path="crear-activo" element={<FormActivos/>} />
        <Route path="editar-activo/:id" element={<FormActivos/>} />
        

        
      </Route>
    </RoutesWithNotFound>
  );
};
