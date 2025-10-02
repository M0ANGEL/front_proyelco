import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Alert, Col, Row, Select, Typography } from "antd";
import { useFormContext } from "react-hook-form";
import { Props } from "./types";
import { TipoProyectoRectangles } from "./TipoProyectoRectangles";
import { useState } from "react";

const { Text } = Typography;

export const DatosConfigProyecto = ({
  selectTipoProcesos,
  selectTipoProyecto,
}: Props) => {
  const methods = useFormContext();
  const [tipoProyecto, setTipoProyecto] = useState<string | null>(null);

  const handleChangeProcesos = (procesos: any[]) => {
    methods.setValue("procesos", procesos);
  };

  return (
    <Row gutter={[12, 6]}>
      <Col xs={24} sm={24}>
        <StyledFormItem required label="Seleciona el tipo de proyecto:">
          <div style={{ marginBottom: 10 }}>
            <div style={{ marginBottom: 10 }}>
              <Col xs={24} sm={6}>
              <Select
                options={selectTipoProyecto}
                placeholder="Tipo de Proyecto"
                onChange={(value) => setTipoProyecto(value)} //  guardar selección
              />
            </Col>
            </div>
            {tipoProyecto == "2" && (
              <>
                <Col span={24}>
                  <Alert
                    message="Para los proyectos de casas, el proceso de fundición se configura de manera interna. Continúa con los demás procesos del proyecto."
                    type="success"
                  />
                </Col>
              </>
            )}
          </div>

          {/*  Pasar el tipoProyecto al hijo */}
          <TipoProyectoRectangles
            tipoProyecto={tipoProyecto}
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
