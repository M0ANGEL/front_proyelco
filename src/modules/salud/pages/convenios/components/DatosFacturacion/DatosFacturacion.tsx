import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Alert, Col, Collapse, Input, Row, Select, Typography } from "antd";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ModalListaPrecios } from "../ModalListaPrecios";
import { Props } from "./types";

const { Text } = Typography;
const { Panel } = Collapse;

export const DatosFacturacion = ({ selectTipoFacturacion }: Props) => {
  const [openModalListaPrecios, setOpenModalListaPrecios] =
    useState<boolean>(false);
  const methods = useFormContext();

  // Observar el valor actual del campo tipo_obra (0 = Simétrica, 1 = Personalizada)
  const tipoObra = useWatch({
    control: methods.control,
    name: "tipo_obra",
  });
  const cantidadTorres = useWatch({ name: "torres", control: methods.control });

  const renderPersonalizada = () => {
    const bloques = [];
    const totalTorres = parseInt(cantidadTorres || "0", 10);

    for (let i = 0; i < totalTorres; i++) {
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
                <Col xs={24} sm={12}>
                  <Controller
                    name={`bloques[${i}].pisos`}
                    control={methods.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Cantidad de pisos requerida",
                      },
                      pattern: {
                        value: /^[0-9]+$/, // Ensure only numbers are allowed
                        message: "Solo se permiten números",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cantidad de Pisos">
                        <Input
                          {...field}
                          placeholder="Solo Numero"
                          type="number" // Restrict input to numbers only
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Controller
                    name={`bloques[${i}].apt`}
                    control={methods.control}
                    rules={{
                      required: {
                        value: true,
                        message: "Cantidad de apartamentos requerida",
                      },
                      pattern: {
                        value: /^[0-9]+$/, // Ensure only numbers are allowed
                        message: "Solo se permiten números",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cantidad de Apartamentos">
                        <Input
                          {...field}
                          placeholder="Solo Numero"
                          type="number" // Restrict input to numbers only
                          status={error && "error"}
                        />
                        <Text type="danger">{error?.message}</Text>
                      </StyledFormItem>
                    )}
                  />
                </Col>
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
            message="Selecciona cantidad de torres, por cada torre tendrás que especificar la cantidad de apartamentos y cantidad de pisos. Tendrás la opción de duplicar una plantilla ya creada."
            type="success"
          />
        </Col>
        {bloques}
      </>
    );
  };

  return (
    <>
      <ModalListaPrecios
        open={openModalListaPrecios}
        setOpen={(value: boolean) => setOpenModalListaPrecios(value)}
        handleSelectLP={(id: string, descripcion: string) => {
          methods.setValue("cod_listapre", id);
          methods.setValue("id_listapre", descripcion);
          setOpenModalListaPrecios(false);
        }}
      />

      <Row gutter={[12, 6]}>
        {/* tipo de proyecto */}
        <Col xs={24} sm={12} md={12}>
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
                  options={selectTipoFacturacion}
                  placeholder="Tipo de Proyecto"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* tipo de obra */}
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="tipo_obra"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo de Obra es requerido",
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
                  placeholder="Selecciona Tipo de Obra"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* Sección para tipo de obra SIMÉTRICA */}
        {tipoObra === 0 && (
          <>
            <Col xs={24} sm={12} md={12}>
              <Controller
                name="torres"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "La cantidad de torres es requerida",
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

            <Col xs={24} sm={12} md={12}>
              <Controller
                name="cant_pisos"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "La cantidad de pisos es requerida",
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

            <Col xs={24} sm={12} md={12}>
              <Controller
                name="apt"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "La cantidad de apartamentos es requerida",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Cantidad Apartamentos:">
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

        {/* Sección para tipo de obra PERSONALIZADA */}
        {tipoObra === 1 && (
          <>
            <Col xs={24} sm={12} md={12}>
              <Controller
                name="torres"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "La cantidad de torres es requerida",
                  },
                  pattern: {
                    value: /^[0-9]+$/, // This ensures only numbers are allowed
                    message: "Solo se permiten números",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <StyledFormItem required label="Cantidad Torres:">
                    <Input
                      {...field}
                      placeholder="Solo Numero"
                      type="number" // Ensure the input is of type number
                      status={error && "error"}
                    />
                    <Text type="danger">{error?.message}</Text>
                  </StyledFormItem>
                )}
              />
            </Col>
          </>
        )}
        {tipoObra === 1 && cantidadTorres && renderPersonalizada()}
      </Row>
    </>
  );
};
