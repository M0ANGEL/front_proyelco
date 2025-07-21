import { client} from "../client";


//llamdo de graficas para proyectos
export const getGrafiaPoryectos = async (): Promise<any> => {
  return await client.get("dashboards/indexMisProyectos", {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};



//llamdo de graficas para proyectos
export const fetchProjectDetalle = async (id: React.Key): Promise<any> => {
  return await client.get<any>(`dashboards/proyectosDetalles/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};


//llamdo de graficas para proyectos
export const detalleApt = async (data: any): Promise<any> => {
  return await client.post<any>("dashboards/infoApt", data, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
};