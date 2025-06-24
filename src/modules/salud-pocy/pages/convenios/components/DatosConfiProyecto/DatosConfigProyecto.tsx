import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Row, Typography } from "antd";
import { useFormContext } from "react-hook-form";
import { Props } from "./types";
import { TipoProyectoRectangles } from "./TipoProyectoRectangles";

const { Text } = Typography;

export const DatosConfigProyecto = ({ selectTipoProcesos }: Props) => {
  const methods = useFormContext();

  const handleChangeProcesos = (procesos: any[]) => {
    methods.setValue("procesos", procesos);
  };

  return (
    <Row gutter={[12, 6]}>
      <Col xs={24} sm={24}>
        <StyledFormItem required label="Procesos:">
          <TipoProyectoRectangles
            tipos={selectTipoProcesos}
            onChangeTipos={handleChangeProcesos}
          />
          <Text type="danger">
            {methods.formState.errors.procesos?.message}
          </Text>
        </StyledFormItem>
      </Col>
    </Row>
  );
};