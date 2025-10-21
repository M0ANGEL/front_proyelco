import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import {
  Alert,
  Col,
  DatePicker,
  Input,
  Row,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const Documentacion = () => {
  const methods = useFormContext();

  const opcionOperadorRed = [
    { value: "1", label: "EMCALI" },
    { value: "2", label: "CELSIA" },
  ];

  const opcionOrganismo = [
    { value: "1", label: "EMCALI" },
    { value: "2", label: "CELSIA" },
  ];

  const opcionetapa = [
    { value: "1", label: "ET1" },
    { value: "2", label: "MAS ETAPAS" },
  ];

  return (
    <Row gutter={[12, 6]}>
      {/* cuando se crea un proyecyo */}
      <>
        <Col span={24}>
          <Alert message="Selecciona los tipo de documentacion." type="error" />
        </Col>
        {/* operador de red */}
        <Col xs={24} sm={8}>
          <Controller
            name="operador_red"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo de operador de red es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Operador de red:">
                <Select
                  {...field}
                  status={error && "error"}
                  options={opcionOperadorRed}
                  placeholder="--"
                />

                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* organismo */}
        <Col xs={24} sm={8}>
          <Controller
            name="organismo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo de Organismo de Inspeccion es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Organismo de Inspeccion:">
                <Select
                  {...field}
                  status={error && "error"}
                  options={opcionOrganismo}
                  placeholder="--"
                />

                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* organismo */}
        <Col xs={24} sm={8}>
          <Controller
            name="etapa"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "La etapa es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Etapa del proyecto:">
                <Select
                  {...field}
                  status={error && "error"}
                  options={opcionetapa}
                  placeholder="--"
                />

                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        <Col xs={24} sm={12} md={4}>
          <Controller
            name="codigo_proyecto_documentos"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Codigo docuemnto del Poryecto es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Codigo Documentos:">
                <Input
                  showCount
                  {...field}
                  maxLength={20}
                  placeholder="00"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* fecha fin del proyecto */}
        <Col xs={24} sm={12} md={6}>
          <Controller
            name="fecha_entrega"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha de entrega del proyecto es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem
                required
                label={
                  <span>
                    Fecha de entrega del proyecto{" "}
                    <Tooltip title="Esta fecha se usa para el calculo de entrega de documentos, revisar que la fecha es la correcta">
                      <InfoCircleOutlined
                        style={{ color: "#faad14", cursor: "pointer" }}
                      />
                    </Tooltip>
                  </span>
                }
              >
                <DatePicker
                  {...field}
                  status={error && "error"}
                  placeholder="10/01/01"
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </>
    </Row>
  );
};
