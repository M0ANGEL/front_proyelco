/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import useSessionStorage from "@/modules/common/hooks/useSessionStorage";
import { Col, Input, Row, Select, SelectProps, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { KEY_ROL } from "@/config/api";
import { Props } from "./types";

const { Text } = Typography;
const selectTipoBodega = [
  { value: "0", label: "Bodega" },
  { value: "1", label: "Farmacia" },
  { value: "2", label: "Centro de Costo / Sede" },
];

export const DatosBasicos = ({ bodega, empresas, localidades }: Props) => {
  const [selectEmpresa, setSelectEmpresas] = useState<SelectProps["options"]>(
    []
  );
  const [selectLocalidad, setSelectLocalidad] = useState<
    SelectProps["options"]
  >([]);
  const { getSessionVariable } = useSessionStorage();
  const methods = useFormContext();

  const [user_rol] = useState<string>(getSessionVariable(KEY_ROL));

  useEffect(() => {
    methods.reset(
      bodega
        ? {
            bod_nombre: bodega.bod_nombre,
            bod_localicad: parseInt(bodega.bod_localicad),
            bod_cencosto: bodega.bod_cencosto,
            bod_tercero: bodega.bod_tercero,
            prefijo: bodega.prefijo,
            direccion: bodega.direccion,
            estado: bodega.estado,
            id_contrato: bodega.id_contrato,
            id_empresa: bodega.id_empresa,
            tipo_bodega: bodega.tipo_bodega,
            estado_inventario: bodega.estado_inventario,
          }
        : {
            bod_nombre: null,
            bod_localicad: null,
            bod_cencosto: null,
            bod_tercero: null,
            prefijo: null,
            direccion: null,
            estado: "1",
            id_contrato: "1",
            id_empresa: null,
            estado_inventario: "0",
          }
    );

    const options = empresas?.map((empresa) => {
      return { label: empresa.emp_nombre, value: empresa.id.toString() };
    });
    setSelectEmpresas(options);
    const optionsLoc = localidades?.map((localidad) => {
      return {
        label: `${localidad.municipio} - ${localidad.departamento}`,
        value: localidad.id,
      };
    });
    setSelectLocalidad(optionsLoc);
  }, [bodega, empresas, localidades]);

  return (
    <Row gutter={24}>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="bod_nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre es requerido",
            },
            maxLength: {
              value: 25,
              message: "El nombre debe tener hasta 25 caracteres",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre:">
              <Input
                {...field}
                placeholder="Nombre de la bodega"
                disabled={
                  bodega && !["administrador"].includes(user_rol) ? true : false
                }
                status={error && "error"}
                maxLength={25}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
        <Controller
          name="prefijo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Prefijo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Prefijo:">
              <Input
                {...field}
                placeholder="Prefijo de la bodega"
                status={error && "error"}
                disabled={bodega ? true : false}
                maxLength={3}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
        <Controller
          name="bod_localicad"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Localidad es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Localidad:">
              <Select
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toString()
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) !== -1
                }
                {...field}
                placeholder="Localidad de la bodega"
                status={error && "error"}
                options={selectLocalidad}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
        <Controller
          name="direccion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Dirección es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Dirección:">
              <Input
                {...field}
                placeholder="Dirección de la bodega"
                status={error && "error"}
                maxLength={80}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
        <Controller
          name="tipo_bodega"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Tipo bodega es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo bodega">
              <Select
                {...field}
                options={selectTipoBodega}
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="bod_cencosto"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Centro de costo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Centro de costo:">
              <Input
                {...field}
                placeholder="Centro de costo"
                status={error && "error"}
                maxLength={6}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
        <Controller
          name="bod_tercero"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Tercero es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tercero:">
              <Input
                {...field}
                placeholder="Tercero de la bodega"
                status={error && "error"}
                maxLength={10}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
        <Controller
          name="id_empresa"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Empresa">
              <Select
                {...field}
                options={selectEmpresa}
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
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
            <StyledFormItem required label="Estado">
              <Select
                {...field}
                options={[
                  { value: "0", label: "INACTIVO" },
                  { value: "1", label: "ACTIVO" },
                ]}
                status={error && "error"}
                disabled={!bodega ? true : false}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
        <Controller
          name="estado_inventario"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Estado Inventario es requerido",
            },
          }}
          defaultValue={"1"}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Estado Inventario">
              <Select
                {...field}
                options={[
                  { value: "0", label: "No" },
                  { value: "1", label: "Si" },
                ]}
                status={error && "error"}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
