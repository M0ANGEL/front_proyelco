/* eslint-disable react-hooks/exhaustive-deps */
// import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";
import { Typography } from "antd";
import { FolderOpenOutlined } from "@ant-design/icons";
import { ListarDocumentos } from "../../components";
import { StyledCard } from "@/modules/common/layout/DashboardLayout/styled";

const { Text } = Typography;

export const ListPeriodos = () => {
  return (
    <>
      <StyledCard
        title={
          <Text>
            <FolderOpenOutlined /> Módulo Períodos
          </Text>
        }
      >
        <ListarDocumentos />
      </StyledCard>
    </>
  );
};
