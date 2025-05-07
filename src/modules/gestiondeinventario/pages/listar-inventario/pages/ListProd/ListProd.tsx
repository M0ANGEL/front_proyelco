/* eslint-disable react-hooks/exhaustive-deps */
// import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Typography } from "antd";
import { DatabaseOutlined } from "@ant-design/icons";
import { ListarProductos } from "../../components";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

export const ListProd = () => {
  return (
    <>
      <StyledCard
        title={
          <Text>
            <DatabaseOutlined /> Módulo Búsqueda de Productos
          </Text>
        }
      >
        <ListarProductos />
      </StyledCard>
    </>
  );
};
