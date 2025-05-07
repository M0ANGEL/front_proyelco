/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Controller, useFormContext } from "react-hook-form";
import { Col, Input, Row, Select, Tooltip, Typography } from "antd";
import { useEffect } from "react";
import { Props } from "./types";

import { InfoCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const DatosBasicos = ({ modulo }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      modulo
        ? {
            cod_modulo: modulo.cod_modulo,
            nom_modulo: modulo.nom_modulo,
            desc_modulo: modulo.desc_modulo,
            estado: modulo.estado,
          }
        : {
            cod_modulo: null,
            nom_modulo: null,
            desc_modulo: null,
            estado: "1",
          }
    );
  }, [modulo]);
  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="cod_modulo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Código es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Código:">
                <Input
                  {...field}
                  placeholder="Código del módulo"
                  status={error && "error"}
                  disabled={modulo ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
          <Controller
            name="nom_modulo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Nombre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem
                required
                label={
                  <Tooltip
                    title={
                      <Text style={{ color: "white" }}>
                        Este nombre es la posición número 1, por ejemplo en la
                        url <Text type="warning">modulo</Text>/menu/submenu, el
                        valor que ingreses aquí estaría en la mitad de la url
                      </Text>
                    }
                  >
                    <Text>Nombre: </Text>
                    <InfoCircleOutlined style={{ color: "#1677ff" }} />
                  </Tooltip>
                }
              >
                <Input
                  {...field}
                  placeholder="Nombre del módulo"
                  status={error && "error"}
                  disabled={modulo ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="desc_modulo"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Descripción es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Descripción">
                <Input
                  {...field}
                  placeholder="Descripción del módulo"
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
                  disabled={!modulo ? true : false}
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
