import { Tabs, Typography } from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { ListAbiertosGenerados } from "../components/abiertosGenerados/ListAbiertosGenerados";
import { ListCerrados } from "../components/cerradosGenerados/ListCerrados";
import { ListCalificados } from "../components/calificadosGenerados/ListCalificados";
import { ListRechazados } from "../components/rechazadosGenerados/ListRechazados";
/* import { ListRechazados } from "../components/rechazados/ListRechazados"; */

const { Text } = Typography;

export const ListTicketsGenerados = () => {
  return (
    <StyledCard>
      <Tabs
        defaultActiveKey="1"
        destroyInactiveTabPane={true} 
        items={[
          {
            key: "1",
            label: <Text>Tickets Abiertos</Text>,
            children: <ListAbiertosGenerados/>,
          },
         /*  {
            key: "2",
            label: <Text>Tickets Cerrados</Text>,
            children: <ListCerrados />,
          }, */
          {
            key: "3",
            label: <Text>Tickets Calificados | cerrados</Text>,
            children: <ListCalificados />,
          },
          {
            key: "4",
            label: <Text>Tickets Rechazados</Text>,
            children: <ListRechazados />,
          },
        ]}
      />
    </StyledCard>
  );
};
