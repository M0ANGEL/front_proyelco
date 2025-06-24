import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListCarguePapeleria } from "../pages";
import { HistoricoPapeleria } from "../historico/HistoricoPapeleria";



export const CarguePapeleria = () => {
  return (  
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListCarguePapeleria />} />
        <Route path="/papeleria-cargue-archivo" element={<ListCarguePapeleria />} />
        <Route path="/papeleria" element={<HistoricoPapeleria />} />
      </Route>
    </RoutesWithNotFound>
  );
};
