import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {TicketsPage, CategoriasRoutes, SubCategoriasRoutes, AutorizacionRoutes, PreguntasRoutes, AdminTicketsRoutes, PreguntasDinamicasRoutes} from "../pages";
import { CrearTicketsRoutes } from "../pages/crearTickets/routes";
import { GestionTicketsRoutes } from "../pages/gestionTickets";
import { ReporteTicketsRoute } from "../pages/reportesTickets";
import { TickestGeneradosRoutes } from "../pages/ticketsGenerados";



export const TickestRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<TicketsPage />} />
        <Route path="/categorias/*" element={<CategoriasRoutes />} />
        <Route path="/subcategorias/*" element={<SubCategoriasRoutes />} />
        <Route path="/autorizacion/*" element={<AutorizacionRoutes />} />
        <Route path="/crear-ticket/*" element={<CrearTicketsRoutes />} />
        <Route path="/administracion-tickets/*" element={<AdminTicketsRoutes />} />
        <Route path="/preguntas-tickets/*" element={<PreguntasRoutes />} />
        <Route path="/gestion-tickets/*" element={<GestionTicketsRoutes />} />
        <Route path="/reporte-tickets/*" element={<ReporteTicketsRoute />} />
        <Route path="/preguntas-dinamicas-tickets/*" element={<PreguntasDinamicasRoutes />} />
        <Route path="/tickets-generados/*" element={<TickestGeneradosRoutes />} />
      </Route>
    </RoutesWithNotFound>
  );
};
