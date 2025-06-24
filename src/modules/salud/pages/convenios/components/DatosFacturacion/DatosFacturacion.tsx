import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Alert, Col, Collapse, Input, Row, Select, Typography } from "antd";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { Props } from "./types";
import { useParams } from "react-router-dom";

const { Text } = Typography;
const { Panel } = Collapse;

export const DatosFacturacion = ({
  selectTipoProyecto,
  selectUSuarios,
  selectIngeniero,
}: Props) => {
  const methods = useFormContext();

  const tipoObra = useWatch({
    control: methods.control,
    name: "tipo_obra",
  });

  const cantidadTorres = useWatch({
    name: "torres",
    control: methods.control,
  });

  const pisosPorTorre = useWatch({
    name: "bloques",
    control: methods.control,
  });


  const { id } = useParams<{ id: string }>();

  const renderPersonalizada = () => {
    const bloques = [];
    const totalTorres = parseInt(cantidadTorres || "0", 10);

    for (let i = 0; i < totalTorres; i++) {
      const cantidadPisos = parseInt(pisosPorTorre?.[i]?.pisos || "0", 10);
      const inputsPorPiso = [];

      for (let j = 0; j < cantidadPisos; j++) {
        inputsPorPiso.push(
          <Col xs={24} sm={4} key={`piso-${j}`}>
            <Controller
              name={`bloques[${i}].apartamentosPorPiso[${j}]`}
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Cantidad de apartamentos requerida",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo se permiten números",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label={`Aptos en Piso ${j + 1}`}>
                  <Input
                    {...field}
                    placeholder="Solo número"
                    type="number"
                    status={error && "error"}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        );
      }

      bloques.push(
        <Col span={24} key={i}>
          <Collapse
            style={{ backgroundColor: "#1a4c9e" }}
            expandIconPosition="right"
          >
            <Panel
              header={`Torre ${i + 1}`}
              key={i}
              style={{ color: "#FFFFFF" }}
            >
              <Row gutter={[12, 6]}>
                <Col xs={24} sm={24}>
                  <Controller
                    name={`bloques[${i}].pisos`}
                    control={methods.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Cantidad de pisos requerida",
                      },
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Solo se permiten números",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cantidad de Pisos">
                        <Input
                          {...field}
                          placeholder="Solo número"
                          type="number"
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                {inputsPorPiso}
              </Row>
            </Panel>
          </Collapse>
        </Col>
      );
    }

    return (
      <>
        <Col span={24}>
          <Alert
            message="Selecciona cantidad de torres. Por cada torre podrás especificar cuántos pisos y cuántos apartamentos por piso."
            type="success"
          />
        </Col>
        {bloques}
      </>
    );
  };

  return (
    <Row gutter={[12, 6]}>
      {/* apt para activacion por dia   */}
       <Col xs={24} sm={4}>
        <Controller
          name="activador_pordia_apt"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Numero de activacion de apt por dia es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Activacion por dia:">
               <Input
                  {...field}
                  status={error && "error"}
                  placeholder="00"
                  type="number"
                />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* usuario asignado */}
      <Col xs={24} sm={6}>
        <Controller
          name="encargado_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Usuario asignado de proyecto es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Encargado Proyecto:">
              <Select
                {...field}
                status={error && "error"}
                options={selectUSuarios}
                placeholder="Encargado"
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/*  ingeniero encargado del proyecto  */}
      <Col xs={24} sm={6}>
        <Controller
          name="ingeniero_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Usuario asignado de proyecto es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Ingeniero Encargado:">
              <Select
                {...field}
                status={error && "error"}
                options={selectIngeniero}
                placeholder="Ingeniero Encargado"
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {!id && (
        <>
          {/* Tipo Proyecto */}
          <Col xs={24} sm={4}>
            <Controller
              name="tipoProyecto_id"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Tipo de proyecto es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Tipo Proyecto:">
                  <Select
                    {...field}
                    status={error && "error"}
                    options={selectTipoProyecto}
                    placeholder="Tipo de Proyecto"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>

          {/* Tipo Obra */}
          <Col xs={24} sm={4}>
            <Controller
              name="tipo_obra"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Tipo de obra es requerido",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Tipo de Obra">
                  <Select
                    {...field}
                    options={[
                      { value: 1, label: "Personalizada" },
                      { value: 0, label: "Simétrica" },
                    ]}
                    status={error && "error"}
                    placeholder="Selecciona tipo de obra"
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>

          {/* Simétrica */}
          {tipoObra === 0 && (
            <>
              <Col xs={24} sm={12}>
                <Controller
                  name="torres"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de torres requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Cantidad Torres:">
                      <Input
                        {...field}
                        placeholder="00"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>

              <Col xs={24} sm={12}>
                <Controller
                  name="cant_pisos"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de pisos requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Cantidad Pisos:">
                      <Input
                        {...field}
                        placeholder="00"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
              <Col xs={24} sm={12}>
                <Controller
                  name="apt"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de apartamentos requerida",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem
                      required
                      label="Cantidad Apartamentos por Piso:"
                    >
                      <Input
                        {...field}
                        placeholder="00"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </>
          )}

          {/* Personalizada */}
          {tipoObra === 1 && (
            <>
              <Col xs={24} sm={4}>
                <Controller
                  name="torres"
                  control={methods.control}
                  rules={{
                    required: {
                      value: true,
                      message: "Cantidad de torres requerida",
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo se permiten números",
                    },
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <StyledFormItem required label="Cantidad Torres:">
                      <Input
                        {...field}
                        placeholder="Solo número"
                        type="number"
                        status={error && "error"}
                      />
                      <Text type="danger">{error?.message}</Text>
                    </StyledFormItem>
                  )}
                />
              </Col>
            </>
          )}

          {/* Renderización personalizada */}
          {tipoObra === 1 && cantidadTorres && renderPersonalizada()}
        </>
      )}
    </Row>
  );
};
