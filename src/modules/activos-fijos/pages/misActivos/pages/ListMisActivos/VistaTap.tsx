import { Tabs, Typography } from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { ListMisActivosPendientes } from "../vistasTap/ListMisActivosPendientes";
import { ListMisActivos } from "../vistasTap/ListMisActivos";

const { Text } = Typography;

export const VistaTap = () => {
  return (
    <StyledCard>
      <Tabs
        defaultActiveKey="1"
        destroyInactiveTabPane={true} 
        items={[
          {
            key: "1",
            label: <Text>Activos por aceptar</Text>,
            children: <ListMisActivosPendientes />,
          },
          {
            key: "2",
            label: <Text>Mis Activos</Text>,
            children: <ListMisActivos />,
          },
          
        ]}
      />
    </StyledCard>
  );
};