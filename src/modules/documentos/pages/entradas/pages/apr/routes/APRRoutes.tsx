import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import { ListAPR,FormAPR  } from "../pages";


export const APRRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListAPR/>}/>
        <Route path="/create" element={<FormAPR/>}/>
        <Route path="/edit/:id" element={<FormAPR />} />
        <Route path="/show/:id" element={<FormAPR />} />
        <Route path="/anular/:id" element={<FormAPR />} />
      </Route>
    </RoutesWithNotFound>
  );
};
