// DatosConfigProyecto.tsx
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Row, Typography } from "antd";
import {  useFormContext } from "react-hook-form";
import { Props } from "./types";
import { TipoProyectoRectangles } from "./TipoProyectoRectangles";

const { Text } = Typography;

export const DatosConfigProyecto = ({ selectTipoProcesos }: Props) => {
  const methods = useFormContext();

  return (
    <Row gutter={[12, 6]}>
      {/* Selector visual con rectángulos arrastrables */}
      <Col xs={24} sm={24}>
        <StyledFormItem required label="Procesos:">
          <TipoProyectoRectangles
            tipos={selectTipoProcesos}
            value={methods.watch("tipoProyecto_id")}
            onSelect={(id) => methods.setValue("tipoProyecto_id", id)}
          />
          <Text type="danger">
            {methods.formState.errors.tipoProyecto_id?.message}
          </Text>
        </StyledFormItem>
      </Col>
    </Row>
  );
};