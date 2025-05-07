import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { CategoryRoutes, ParametrizacionPage, SubCategoriaRoutes, ParametrosRoutes, Parametros_SubCategoriaRoutes, DatosRoutes, ActivosRoutes} from "../pages";
import { SubLocalizacionAreaRoutes } from "../pages/SubLocalizacionArea";
import { ListSolicitudesPendientesActivos } from "../../solicitarActivos";
import { RetornoActivoProovedoresRoutes } from "../../retornoActivoProovedor";
import { BajaActivosRoutes } from "../pages/Activos/BajaActivosFijos/routes/BajaActivosRoutes";



export const ParametrizacionRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ParametrizacionPage />} />
        <Route path="categoria/*" element={<CategoryRoutes />} />
        <Route path="sub-categoria/*" element={<SubCategoriaRoutes />} />
        <Route path="parametro/*" element={<ParametrosRoutes/>}/>
        <Route path="parametro-sub-categoria/*" element={<Parametros_SubCategoriaRoutes/>}/>
        <Route path="datos/*" element={<DatosRoutes/>}/>
        <Route path="activos/*" element={<ActivosRoutes/>}/>
        <Route path="usuarios/" element={<ActivosRoutes/>}/>
        <Route path="sub-localizacion-area/*" element={<SubLocalizacionAreaRoutes/>}/>
        <Route path="solicitudes-activos/*" element={<ListSolicitudesPendientesActivos/>}/>
        <Route path="baja-activos/*" element={<BajaActivosRoutes/>}/>
        <Route path="retorno-activo-provedor/*" element={<RetornoActivoProovedoresRoutes/>}/>

        




      </Route>
    </RoutesWithNotFound>
  );
};
