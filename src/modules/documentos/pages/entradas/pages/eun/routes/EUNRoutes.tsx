import { RoutesWithNotFound } from "@/modules/common/components";
import { AuthGuard } from "@/modules/common/guards";
import { Route } from "react-router-dom";
import {ListEUN,FormEUN} from "../pages";


export const EUNRoutes = () => {
  return (
    <RoutesWithNotFound>
      <Route element={<AuthGuard />}>
        <Route path="/" element={<ListEUN/>}/>
        <Route path="/create/:sun_id" element={<FormEUN/>}/>
        <Route path="/edit/:id" element={<FormEUN />} />
        <Route path="/show/:id" element={<FormEUN />} />
        <Route path="/anular/:id" element={<FormEUN />} />
      </Route>
    </RoutesWithNotFound>
  );
};
