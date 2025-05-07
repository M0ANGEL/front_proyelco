import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Alert, Col, Collapse, Input, Row, Select, Typography } from "antd";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ModalListaPrecios } from "../ModalListaPrecios";
import { Props } from "./types";

const { Text } = Typography;
const { Panel } = Collapse;

export const DatosFacturacion = ({ selectTipoFacturacion }: Props) => {
  const [openModalListaPrecios, setOpenModalListaPrecios] = useState(false);
  const methods = useFormContext();

  const tipoObra = useWatch({ name: "tipo_obra", control: methods.control });
  const cantidadTorres = useWatch({ name: "torres", control: methods.control });

  const renderSimetrica = () => (
    <>
      {/* Cantidad Pisos */}
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
                style={{ backgroundColor: "#000000", color: "#FFFFFF", borderColor: "#FF0000" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* Cantidad Apartamentos */}
      <Col xs={24} sm={12} md={12}>
        <Controller
          name="apt"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La cantidad de apartamenentos es requerida",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Cantidad Apartamentos:">
              <Input
                {...field}
                placeholder="00"
                status={error && "error"}
                style={{ backgroundColor: "#000000", color: "#FFFFFF", borderColor: "#FF0000" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </>
  );

  const renderPersonalizada = () => {
    const bloques = [];
    const totalTorres = parseInt(cantidadTorres || "0", 10);

    for (let i = 0; i < totalTorres; i++) {
      bloques.push(
        <Col span={24} key={i}>
          <Collapse
            style={{ backgroundColor: "#000000", borderColor: "#FF0000" }}
            expandIconPosition="right"
          >
            <Panel header={`Bloque ${i + 1}`} key={i} style={{ color: "#FFFFFF" }}>
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
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cantidad de Pisos">
                        <Input
                          {...field}
                          placeholder="00"
                          status={error && "error"}
                          style={{ backgroundColor: "#000000", color: "#FFFFFF", borderColor: "#FF0000" }}
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
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <StyledFormItem required label="Cantidad de Apartamentos">
                        <Input
                          {...field}
                          placeholder="00"
                          status={error && "error"}
                          style={{ backgroundColor: "#000000", color: "#FFFFFF", borderColor: "#FF0000" }}
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
            message="Selecciona la cantidad de torres. Por cada torre, especifica cantidad de apartamentos y pisos. Puedes duplicar una plantilla ya creada."
            type="info"
            showIcon
            style={{ backgroundColor: "#000000", color: "#FFFFFF", borderColor: "#FF0000" }}
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
        setOpen={setOpenModalListaPrecios}
        handleSelectLP={(id: string, descripcion: string) => {
          methods.setValue("cod_listapre", id);
          methods.setValue("id_listapre", descripcion);
          setOpenModalListaPrecios(false);
        }}
      />
      <Row gutter={[12, 6]} style={{ backgroundColor: "#000000", padding: "20px" }}>
        {/* Tipo Proyecto */}
        <Col xs={24} sm={12}>
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
              <StyledFormItem required label="Tipo Proyecto">
                <Select
                  {...field}
                  status={error && "error"}
                  options={selectTipoFacturacion}
                  placeholder="Selecciona tipo de proyecto"
                  style={{ backgroundColor: "#000000", color: "#FFFFFF", borderColor: "#FF0000" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* Tipo Obra */}
        <Col xs={24} sm={12}>
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
                  style={{ backgroundColor: "#000000", color: "#FFFFFF", borderColor: "#FF0000" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

        {/* Torres (solo si hay obra personalizada) */}
        {tipoObra === 1 && (
          <Col xs={24} sm={12}>
            <Controller
              name="torres"
              control={methods.control}
              rules={{
                required: {
                  value: true,
                  message: "Cantidad de torres es requerida",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <StyledFormItem required label="Cantidad de Torres">
                  <Input
                    {...field}
                    placeholder="00"
                    status={error && "error"}
                    style={{ backgroundColor: "#000000", color: "#FFFFFF", borderColor: "#FF0000" }}
                  />
                  <Text type="danger">{error?.message}</Text>
                </StyledFormItem>
              )}
            />
          </Col>
        )}

        {/* Render dinámico según tipo de obra */}
        {tipoObra === 0 && renderSimetrica()}
        {tipoObra === 1 && cantidadTorres && renderPersonalizada()}
      </Row>
    </>
  );
};
