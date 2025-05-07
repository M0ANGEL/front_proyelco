import { Tabs, Typography } from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { ListAutorizacion } from "../ListAutorizacion";
import { ListHistorialAutorizacion } from "../historialTickets/pages/Historial";

const { Text } = Typography;

export const TagAutorizacion = () => {
  return (
    <StyledCard>
      <Tabs
        defaultActiveKey="1"
        destroyInactiveTabPane={true} 
        items={[
          {
            key: "1",
            label: <Text>Tickets Autorizar</Text>,
            children: <ListAutorizacion />,
          },
          {
            key: "2",
            label: <Text>Historial Tickets Autorizados</Text>,
            children: <ListHistorialAutorizacion /> ,
          },
        ]}
      />
    </StyledCard>
  );
};
