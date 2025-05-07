import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListMantenimiento,FormMantenimiento} from "../pages";

export const MantenimientoRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListMantenimiento />} />
        <Route path="crear-mantenimiento" element={<FormMantenimiento/>} />
        <Route path="editar-mantenimiento/:id" element={<FormMantenimiento/>} />
        

        
      </Route>
    </RoutesWithNotFound>
  );
};
