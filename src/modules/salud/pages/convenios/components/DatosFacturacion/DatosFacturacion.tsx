/* eslint-disable react-hooks/exhaustive-deps */

import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Select, Space, Typography } from "antd";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { ModalListaPrecios } from "../ModalListaPrecios";
import { Props } from "./types";

const { Text } = Typography;

export const DatosFacturacion = ({
  selectTipoFacturacion,
  selectConceptos,
  selectBodegas,
}: Props) => {
  const [openModalListaPrecios, setOpenModalListaPrecios] =
    useState<boolean>(false);
  const [searchSelect, setSearchSelect] = useState<string>("");
  const methods = useFormContext();
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
        <Col xs={24} sm={24} md={12}>
          <StyledFormItem label="Lista de Precios:">
            <Space.Compact style={{ width: "100%" }}>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                style={{ width: 50 }}
                onClick={() => setOpenModalListaPrecios(true)}
              />
              <Controller
                name="cod_listapre"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      readOnly
                      {...field}
                      placeholder="ID"
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
                value=" - "
                readOnly
              />
              <Controller
                name="id_listapre"
                control={methods.control}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <Input
                      readOnly
                      {...field}
                      status={error && "error"}
                      placeholder="Nombre"
                      style={{ textAlign: "center", width: "100%" }}
                    />
                  </>
                )}
              />
            </Space.Compact>
          </StyledFormItem>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Controller
            name="tipo_factu"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Tipo Facturación es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Tipo Facturación:">
                <Select
                  {...field}
                  options={selectTipoFacturacion}
                  placeholder="Tipo Facturación"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="centro_costo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Centro de Costo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Centro de Costo:">
                <Input
                  {...field}
                  placeholder="Centro de Costo"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="periodo_pago"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Periodo de Pago es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Periodo de Pago:">
                <Select
                  {...field}
                  options={[
                    { label: "30 días", value: "30" },
                    { label: "45 días", value: "45" },
                    { label: "60 días", value: "60" },
                    { label: "90 días", value: "90" },
                    { label: "120 días", value: "120" },
                  ]}
                  placeholder="Periodo de Pago"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Controller
            name="bodegas"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Bodegas Asociadas es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Bodegas Asociadas:">
                <Select
                  allowClear
                  {...field}
                  mode="multiple"
                  maxTagCount={10}
                  options={selectBodegas}
                  onBlur={() => {
                    setSearchSelect("");
                  }}
                  style={{ width: "100%" }}
                  status={error && "error"}
                  searchValue={searchSelect}
                  popupMatchSelectWidth={false}
                  onSearch={(value: string) => {
                    setSearchSelect(value);
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  placeholder="Selecciona una o varias Bodegas"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={24} md={24}>
          <Controller
            name="conceptos"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Conceptos es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Conceptos (Servicios):">
                <Select
                  allowClear
                  {...field}
                  mode="multiple"
                  maxTagCount={5}
                  onBlur={() => {
                    setSearchSelect("");
                  }}
                  style={{ width: "100%" }}
                  status={error && "error"}
                  options={selectConceptos}
                  searchValue={searchSelect}
                  onSearch={(value: string) => {
                    setSearchSelect(value);
                  }}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toString()
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  placeholder="Selecciona uno o varios Conceptos"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="cuota_mod"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Cuota Moderadora es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Cuota Moderadora:">
                <Select
                  {...field}
                  placeholder="Cuota Moderadora"
                  options={[
                    { value: 1, label: "Sí" },
                    { value: 0, label: "No" },
                  ]}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="iva"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Facturación Discriminando Iva es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="¿Facturación Discriminando Iva?">
                <Select
                  {...field}
                  options={[
                    { value: 1, label: "Sí" },
                    { value: 0, label: "No" },
                  ]}
                  status={error && "error"}
                  placeholder="¿Facturación Discriminando Iva?"
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="redondeo_iva"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Redondeo de IVA es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Redondeo de IVA:">
                <Select
                  {...field}
                  placeholder="Redondeo de IVA"
                  options={[
                    { value: 0, label: "Redondeo Abajo" },
                    { value: 1, label: "Redondeo Arriba" },
                    { value: 2, label: "Sin redondeo" },
                    { value: 3, label: "Redondeo Automatico" },
                  ]}
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="dto_cuota"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Facturacion Cuota es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem
                required
                label="Descuento de Cuota Moderadora en Facturación:"
              >
                <Select
                  {...field}
                  options={[
                    { value: 0, label: "No" },
                    { value: 1, label: "Sí" },
                  ]}
                  placeholder="Facturacion Cuota moderadora"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} md={12}>
          <Controller
            name="etiqueta_rips"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Etiquetas de Salud es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem
                required
                label="¿Presenta Etiquetas al ministerio de salud?"
              >
                <Select
                  {...field}
                  options={[
                    { value: 0, label: "No" },
                    { value: 1, label: "Sí" },
                  ]}
                  placeholder="Etiquetas de Salud"
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
