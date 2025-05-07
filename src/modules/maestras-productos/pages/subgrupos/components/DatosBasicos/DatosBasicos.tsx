/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Select, SelectProps, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { Props } from "./types";

const { Text } = Typography;

export const DatosBasicos = ({ subgrupo, grupos }: Props) => {
  const [selectGrupo, setSelectGrupos] = useState<SelectProps["options"]>([]);
  const methods = useFormContext();

  useEffect(() => {
    const optionsGrupo = grupos?.map((item) => {
      return { label: item.descripcion, value: item.id.toString() };
    });
    setSelectGrupos(optionsGrupo);
  }, [subgrupo, grupos]);

  useEffect(() => {
    methods.reset(
      subgrupo
        ? {
            descripcion: subgrupo.descripcion,
            grupo_id: subgrupo.grupo_id,
          }
        : {
            descripcion: null,
            grupo_id: null,
          }
    );
  }, [subgrupo]);

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
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
                  placeholder="Descripción"
                  status={error && "error"}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="grupo_id"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Grupo es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Grupo:">
                <Select
                  {...field}
                  options={selectGrupo}
                  placeholder="Grupo"
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
