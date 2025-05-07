/* eslint-disable react-hooks/exhaustive-deps */
// import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { ListarProductos } from "../../components";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

export const ListProd = () => {
  return (
    <>
      <StyledCard
        title={
          <Text>
            <CalendarOutlined /> Módulo Vencimientos
          </Text>
        }
      >
        <ListarProductos />
      </StyledCard>
    </>
  );
};
