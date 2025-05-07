import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { FormTranslados, } from "../pages/FormTraslados";
import { TrasladosActivosPage } from "../pages/TrasladosActivosPage";
import { ListTrasladosActivos } from "../pages/ListTrasladosActivos";
import { ListTrasladosActivosPendientes } from "../pages/ListTrasladosActivosPendientes";
import { ListTrasladosActivosEntrada } from "../pages";
import { ListTrasladosActivosPendientesGerencia } from "../pages/ListTrasladosActivosPendientesGerencia";
import { ListTrasladosActivosPendientesAdmin } from "../pages/ListTrasladosActivosPendientesAdminActivos";

export const TransladosActivosRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={< TrasladosActivosPage/>} />
        <Route path="TAS" element={<ListTrasladosActivos/>} />
        <Route path="TAP" element={<ListTrasladosActivosPendientes/>} />
        <Route path="TAE" element={<ListTrasladosActivosEntrada/>} />
        <Route path="TPG" element={<ListTrasladosActivosPendientesGerencia/>} />
        <Route path="TPAFA" element={<ListTrasladosActivosPendientesAdmin/>} />


        <Route path="tas/crear" element={<FormTranslados/>} />
        <Route path="tas/editar/:id" element={<FormTranslados/>} />


        <Route path="traslados-entrada" element={<FormTranslados/>} />


        
      </Route>
    </RoutesWithNotFound>
  );
};
