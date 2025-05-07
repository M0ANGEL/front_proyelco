import { Tabs, Typography } from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { ListCrearTickets } from "../ListCrearTickts";
import { ListHistorialTickets } from "../historialTickets/pages/Historial";

const { Text } = Typography;

export const TagCrearTickets = () => {
  return (
    <StyledCard>
      <Tabs
        defaultActiveKey="1"
        destroyInactiveTabPane={true} 
        items={[
          {
            key: "1",
            label: <Text>Tickets Abiertos</Text>,
            children: <ListCrearTickets />,
          },
          {
            key: "2",
            label: <Text>Historial Tickets</Text>,
            children: <ListHistorialTickets />,
          },
        ]}
      />
    </StyledCard>
  );
};
