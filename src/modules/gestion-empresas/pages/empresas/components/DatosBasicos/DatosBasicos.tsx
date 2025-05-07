/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Select, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ empresa }: Props) => {
  const methods = useFormContext();
  const [nombreEmpresa, setNombreEmpresa] = useState("");

  useEffect(() => {
    empresa ? setNombreEmpresa(empresa?.emp_nombre) : null;
    methods.reset(
      empresa
        ? {
            emp_nombre: empresa.emp_nombre,
            nit: empresa.nit,
            direccion: empresa.direccion,
            telefono: empresa.telefono,
            estado: empresa.estado,
            servidor_smtp: empresa.servidor_smtp,
            protocolo_smtp: empresa.protocolo_smtp,
            cuenta_de_correo: empresa.cuenta_de_correo,
            contrasena_correo: empresa.contrasena_correo,
          }
        : {
            emp_nombre: null,
            nit: null,
            direccion: null,
            telefono: null,
            estado: "1",
            servidor_smtp: null,
            protocolo_smtp: null,
            cuenta_de_correo: null,
            contrasena_correo: null,
          }
    );
  }, [empresa]);
  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="emp_nombre"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nombre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Nombre:">
                <Input
                  {...field}
                  placeholder="Nombre de la empresa"
                  status={error && "error"}
                  onChange={(e) => {
                    setNombreEmpresa(e.target.value);
                    methods.setValue("emp_nombre", e.target.value);
                  }}
                  value={nombreEmpresa}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="nit"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nit es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Nit:">
                <Input
                  {...field}
                  placeholder="Nit de la empresa"
                  status={error && "error"}
                  disabled={empresa ? true : false}
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
                  placeholder="Dirección de la empresa"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="telefono"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Teléfono es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Teléfono:">
                <Input
                  {...field}
                  placeholder="Teléfono de la empresa"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="dominio_tenant"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Estado es requerido",
              },
            }}
            defaultValue={"sebthi.test"}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Dominio Tenant:">
                <Input
                  {...field}
                  placeholder="Enlace/Host de la empresa"
                  status={error && "error"}
                  disabled={!empresa ? true : false}
                  value={
                    nombreEmpresa.length >= 3
                      ? `${nombreEmpresa.substring(0, 3)}.sebthi.test`
                      : nombreEmpresa
                  }
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
              <StyledFormItem required label="Estado:">
                <Select
                  {...field}
                  options={[
                    { value: "0", label: "INACTIVO" },
                    { value: "1", label: "ACTIVO" },
                  ]}
                  status={error && "error"}
                  disabled={!empresa ? true : false}
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
