import { Tabs, Typography } from "antd";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { EmcaliRoute } from "../components/EMCALI/EmcaliRoute/EmcaliRoute";
import { CelsiaRoute } from "../components/CELSIA/CelsiaRoute/CelsiaRoute";

const { Text } = Typography;

export const ListRed = () => {
  return (
    <StyledCard>
      <Tabs
        defaultActiveKey="1"
        destroyInactiveTabPane={true} 
        items={[
          {
            key: "1",
            label: <Text>EMCALI</Text>,
            children: <EmcaliRoute />,
          },
          {
            key: "2",
            label: <Text>CELSIA</Text>,
            children: <CelsiaRoute />,
          },
        ]}
      />
    </StyledCard>
  );
};
