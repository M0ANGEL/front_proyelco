import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListLinkDescargas } from "../pages/listLinkDescarga";
import { FormCLinkDescargas } from "../pages/FormLinkDescargas";



export const LinkDescargasRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
         <Route path="/" element={<ListLinkDescargas />} />
        <Route path="/create" element={<FormCLinkDescargas />} />
        {/*<Route path="/edit/:id" element={<FormCategorias />} /> */}
      </Route>
    </RoutesWithNotFound>
  );
};
