import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { SearchOutlined } from "@ant-design/icons";
import { ModalTerceros } from "../ModalTerceros";
import { useState } from "react";
import {
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

export const DatosBasicos = () => {
  const [openModalTerceros, setOpenModalTerceros] = useState<boolean>(false);
  const methods = useFormContext();

  const tipoId = methods.watch("regimen_conv");

  return (
    <>
      <ModalTerceros
        open={openModalTerceros}
        setOpen={(value: boolean) => setOpenModalTerceros(value)}
        handleSelectTercero={(nit: string, razon_soc: string) => {
          methods.clearErrors(["nit", "emp_nombre"]);
          methods.setValue("nit", nit);
          methods.setValue("emp_nombre", razon_soc);
          setOpenModalTerceros(false);
        }}
      />
      <Row gutter={[12, 6]}>
        {/* fecha de inicio del proyecto */}
        <Col xs={24} sm={12} md={6}>
          <Controller
            name="fecha_inicio"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Fecha Inicial del proyecto es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Fecha Inicio:">
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

        {/* estado proyecto */}
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
        {/* selecion de cliente */}
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
                  methods.getFieldState("cliente_id").error
                    ? "error"
                    : undefined
                }
                value=" - "
                readOnly
              />
              <Controller
                name="emp_nombre"
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
                      placeholder="Nombre Cliente"
                      style={{ textAlign: "center", width: "100%" }}
                    />
                  </>
                )}
              />
            </Space.Compact>
            <Text type="danger">
              {methods.getFieldState("cliente_id").error
                ? methods.getFieldState("cliente_id").error?.message
                : null}
            </Text>
          </StyledFormItem>
        </Col>

        {/* nombre del proyecto */}
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
                  maxLength={150}
                  placeholder="Descripción"
                  status={error && "error"}
                  disabled={Boolean(tipoId)}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>

          {/* codigo proyecto */}
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="codigo_proyecto"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Codigo Unico del Poryecto es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Codigo Proyecto:">
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
      </Row>
    </>
  );
};
