import { client } from "../client";


//llamdo de graficas para proyectos
export const getGrafiaPoryectos = async (): Promise<any> => {
  return await client.get("dashboards/proyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};