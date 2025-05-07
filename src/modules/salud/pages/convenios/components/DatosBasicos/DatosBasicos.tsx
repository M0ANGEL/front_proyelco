import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import { ModalTerceros } from "../ModalTerceros";
import { useState } from "react";
import { Props } from "./types";
import {
  InputNumber,
  DatePicker,
  Typography,
  Button,
  Select,
  Input,
  Space,
  Col,
  Row,
} from "antd";

const { Text } = Typography;

export const DatosBasicos = ({
  selectTipoConvenio,
  selectCoberturaPlan,
  selectTipoConsulta,
  selectModalidadContratacion,
  selectTipoDispensaciones,
}: Props) => {
  const [openModalTerceros, setOpenModalTerceros] = useState<boolean>(false);
  const methods = useFormContext();

  const tipoId = methods.watch("regimen_conv");

  return (
    <>
      <ModalTerceros
        open={openModalTerceros}
        setOpen={(value: boolean) => setOpenModalTerceros(value)}
        handleSelectTercero={(nit: string, razon_soc: string) => {
          methods.clearErrors(["nit", "nom_nit"]);
          methods.setValue("nit", nit);
          methods.setValue("nom_nit", razon_soc);
          setOpenModalTerceros(false);
        }}
      />
      <Row gutter={[12, 6]}>
        <Col xs={24} sm={12} md={6}>
          <Controller
            name="tipo_id"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo de Convenio es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipo Convenio:">
                <Select
                  {...field}
                  status={error && "error"}
                  options={selectTipoConvenio}
                  placeholder="Tipo de Convenio"
                  // disabled={Boolean(tipoId)}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Controller
            name="estado"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Estado es requerido",
              },
            }}
            defaultValue={"1"}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Estado:">
                <Select
                  {...field}
                  options={[
                    { value: 1, label: "ACTIVO" },
                    { value: 0, label: "INACTIVO" },
                  ]}
                  status={error && "error"}
                  disabled={true}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <StyledFormItem required label="Cliente:">
            <Space.Compact style={{ width: "100%" }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{ width: 50 }}
                onClick={() => setOpenModalTerceros(true)}
                disabled={Boolean(tipoId)}
              />
              <Controller
                name="nit"
                control={methods.control}
                rules={{
                  required: {
                    value: true,
                    message: "Cliente es requerido",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      readOnly
                      {...field}
                      placeholder="NIT"
                      status={error && "error"}
                      style={{ textAlign: "center" }}
                    />
                  </>
                )}
              />
              <Input
                style={{
                  width: 60,
                  pointerEvents: "none",
                  textAlign: "center",
                }}
                status={
                  methods.getFieldState("nit").error ? "error" : undefined
                }
                value=" - "
                readOnly
              />
              <Controller
                name="nom_nit"
                control={methods.control}
                rules={{
                  required: true,
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      readOnly
                      {...field}
                      status={error && "error"}
                      placeholder="Nombre Tercero"
                      style={{ textAlign: "center", width: "100%" }}
                    />
                  </>
                )}
              />
            </Space.Compact>
            <Text type="danger">
              {methods.getFieldState("nit").error
                ? methods.getFieldState("nit").error?.message
                : null}
            </Text>
          </StyledFormItem>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Controller
            name="descripcion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripción es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripción:">
                <Input
                  showCount
                  {...field}
                  maxLength={100}
                  placeholder="Descripción"
                  status={error && "error"}
                  disabled={Boolean(tipoId)}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="valor_total"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Valor Total es requerido",
              },
              min: {
                value: 1,
                message: "El valor del convenio debe ser mayor a cero",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Valor Total:">
                <InputNumber
                  {...field}
                  min={0}
                  controls={false}
                  style={{ width: "100%" }}
                  status={error && "error"}
                  placeholder="Ingresa Valor Total"
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="regimen_conv"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Régimen Convenio es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Régimen Convenio:">
                <Select
                  {...field}
                  status={error && "error"}
                  placeholder="Régimen Convenio"
                  options={[
                    { value: "Contributivo", label: "Contributivo" },
                    { value: "Subsidiado", label: "Subsidiado" },
                    { value: "Especial", label: "Especial" },
                  ]}
                  disabled={Boolean(tipoId)}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Controller
            name="fechaini"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha Inicial es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha Inicial:">
                <DatePicker
                  {...field}
                  status={error && "error"}
                  placeholder="Fecha Inicial"
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Controller
            name="fechafin"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha Final es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha Final:">
                <DatePicker
                  {...field}
                  style={{ width: "100%" }}
                  status={error && "error"}
                  placeholder="Fecha Final"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="num_contrato"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Número Contrato es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Número Contrato:">
                <Input
                  showCount
                  {...field}
                  maxLength={60}
                  placeholder="Número Contrato"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="mod_contrato"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Modalidad de Contratación es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Modalidad de Contratación:">
                <Select
                  {...field}
                  options={selectModalidadContratacion}
                  placeholder="Modalidad de Contratación"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="cober_pb"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Cobertura Plan Beneficios es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Cobertura Plan Beneficios:">
                <Select
                  {...field}
                  options={selectCoberturaPlan}
                  placeholder="Cobertura Plan Beneficios"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="auth_cabe"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Autorización Cabecera es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Autorización Cabecera:">
                <Select
                  {...field}
                  placeholder="Autorización Cabecera"
                  options={[
                    { value: 1, label: "Si" },
                    { value: 0, label: "No" },
                  ]}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Controller
            name="tipo_consulta"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipos de Consultas es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipos de Consultas:">
                <Select
                  {...field}
                  mode="multiple"
                  maxTagCount={4}
                  style={{ width: "100%" }}
                  status={error && "error"}
                  options={selectTipoConsulta}
                  placeholder="Selecciona una o varios Tipos de Consultas"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Controller
            name="auth_det"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Autorización Detalle es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Autorización Detalle:">
                <Select
                  {...field}
                  placeholder="Autorización Detalle"
                  options={[
                    { value: 1, label: "Si" },
                    { value: 0, label: "No" },
                  ]}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Controller
            name="long_det"
            control={methods.control}
            defaultValue={0}
            rules={{
              required: {
                value: true,
                message: "No. Caracteres Det. es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="No. Caracteres Det.:">
                <InputNumber
                  min={0}
                  {...field}
                  controls={false}
                  max={30}
                  placeholder="No. Caracteres Det."
                  status={error && "error"}
                  style={{ width: "100%" }}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="id_tipo_dispensacion"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo Dispensación es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipo Dispensación:">
                <Select
                  {...field}
                  placeholder="Tipo Dispensación"
                  options={selectTipoDispensaciones}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
      </Row>
    </>
  );
};
