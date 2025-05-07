/* eslint-disable react-hooks/exhaustive-deps */
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Typography } from "antd";
import { ListarDocumentos } from "../../components/ListarDocumentos/ListarDocumentos";

const { Text } = Typography;

export const ListAUD = () => {
  return (
    <>
      <StyledCard title={<Text>Estados de Auditoría</Text>}>
        <ListarDocumentos />
      </StyledCard>
    </>
  );
};
