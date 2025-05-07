/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, Row, Select, SelectProps, Typography } from "antd";
import { useEffect, useState } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ tipoDocumento, empresas, grupos }: Props) => {
  const [selectEmpresas, setSelectEmpresas] = useState<SelectProps["options"]>(
    []
  );
  const [selectGrupos, setSelectGrupos] = useState<SelectProps["options"]>([]);
  const methods = useFormContext();

  useEffect(() => {

    console.log(tipoDocumento)
    methods.reset(
      tipoDocumento
        ? {
            codigo: tipoDocumento.codigo,
            descripcion: tipoDocumento.descripcion,
            id_empresa: tipoDocumento.id_empresa,
            id_grupo: tipoDocumento.id_grupo,
            consecutivo: tipoDocumento.consecutivo,
            estado: tipoDocumento.estado,
          }
        : {
            codigo: null,
            descripcion: null,
            id_empresa: null,
            id_grupo: null,
            consecutivo: "1",
            estado: "1",
          }
    );

    const optionsEmpresas = empresas?.map((empresa) => {
      return { label: empresa.emp_nombre, value: empresa.id.toString() };
    });
    setSelectEmpresas(optionsEmpresas);

    const optionsGrupos = grupos?.map((grupo) => {
      return { label: grupo.nombre, value: grupo.id.toString() };
    });
    setSelectGrupos(optionsGrupos);
  }, [tipoDocumento, empresas, grupos]);
  return (
    <>
      <Row gutter={12}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="consecutivo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Consecutivo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Consecutivo:">
                <Input
                  {...field}
                  placeholder="Consecutivo del documento"
                  status={error && "error"}
                  disabled
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="codigo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Codigo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Código:">
                <Input
                  {...field}
                  placeholder="Código del documento"
                  disabled={tipoDocumento ? true : false}
                  status={error && "error"}
                  maxLength={3}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
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
                  {...field}
                  placeholder="Descripción del documento"
                  status={error && "error"}
                  maxLength={60}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="id_grupo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Grupo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Grupo">
                <Select
                  {...field}
                  options={selectGrupos}
                  placeholder="Seleccionar grupo"
                  status={error && "error"}
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
                  options={selectEmpresas}
                  placeholder="Seleccionar empresa"
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
                  disabled={!tipoDocumento ? true : false}
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
