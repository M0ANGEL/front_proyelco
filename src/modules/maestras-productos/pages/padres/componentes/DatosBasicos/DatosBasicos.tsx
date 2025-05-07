/* eslint-disable react-hooks/exhaustive-deps */
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Col, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { ChangeEvent, useEffect } from "react";
import { Props } from "./types";
import { validarPadre } from "@/services/maestras/productosPadreAPI";

const { Text } = Typography;
let timeout: ReturnType<typeof setTimeout> | null;

export const DatosBasicos = ({ productoPadre }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    methods.reset(
      productoPadre
        ? {
            descripcion: productoPadre.descripcion,
            cod_padre: productoPadre.cod_padre,
          }
        : {
            descripcion: null,
            cod_padre: null,
          }
    );
  }, [productoPadre]);

  const checkCodPadre = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    const value = e.target.value;
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    if (value.length > 0) {
      timeout = setTimeout(() => {
        validarPadre(value).then(({ data: { data } }) => {
          if (data.length > 0) {
            methods.setError("cod_padre", {
              message: "Este código padre ya existe",
            });
          } else {
            methods.clearErrors("cod_padre");
          }
        });
      }, 500);
    }
    methods.setValue("cod_padre", value);
  };

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} sm={12} style={{ width: "100%" }}>
          <Controller
            name="cod_padre"
            control={methods.control}
            rules={{
              required: {
                value: true,
                message: "Código Padre es requerido",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <StyledFormItem required label="Código Padre:">
                <Input
                  {...field}
                  placeholder="Código Padre"
                  status={error && "error"}
                  onChange={checkCodPadre}
                  disabled={productoPadre ? true : false}
                />
                <Text type="danger">{error?.message}</Text>
              </StyledFormItem>
            )}
          />
        </Col>
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
      </Row>
    </>
  );
};
