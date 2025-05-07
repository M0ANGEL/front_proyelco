import { Tabs, Typography } from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { ListAbiertos } from "../components/abiertos/ListAbiertos";
import { ListCerrados } from "../components/cerrados/ListCerrados";
import { ListCalificados } from "../components/calificados/ListCalificados";
import { ListRechazados } from "../components/rechazados/ListRechazados";

const { Text } = Typography;

export const ListTickets = () => {
  return (
    <StyledCard>
      <Tabs
        defaultActiveKey="1"
        destroyInactiveTabPane={true} 
        items={[
          {
            key: "1",
            label: <Text>Tickets Abiertos</Text>,
            children: <ListAbiertos />,
          },
          {
            key: "2",
            label: <Text>Tickets Cerrados</Text>,
            children: <ListCerrados />,
          },
          {
            key: "3",
            label: <Text>Tickets Calificados</Text>,
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
