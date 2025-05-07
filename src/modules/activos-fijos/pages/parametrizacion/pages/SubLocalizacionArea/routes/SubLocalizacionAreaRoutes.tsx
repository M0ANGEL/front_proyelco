import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListSubLocalizacionArea } from "../pages";
import {FormSubLocalizacionArea} from "../pages"

export const SubLocalizacionAreaRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListSubLocalizacionArea />} />
        <Route path="editar-sub-localizacion-area/:id" element={<FormSubLocalizacionArea/>} />
        <Route path="crear-sub-localizacion-area" element={<FormSubLocalizacionArea/>}/>
      </Route>
    </RoutesWithNotFound>
  );
};
