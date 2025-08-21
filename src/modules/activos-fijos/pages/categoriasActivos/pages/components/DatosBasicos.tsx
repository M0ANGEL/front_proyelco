import { useEffect } from "react";
import { Col, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "./types";
import TextArea from "antd/es/input/TextArea";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("descripcion", TkCategoria?.descripcion);
      methods.setValue("nombre", TkCategoria?.nombre);
      methods.setValue("prefijo", TkCategoria?.prefijo);
    } else {
      /*  methods.setValue('estado', '1') */
    }
  }, [TkCategoria]);
  return (
    <Row gutter={24}>

      {/* prefijo */}
       <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="prefijo"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "El prefijo es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Prefijo de la categoria">
              <Input
                {...field}
                maxLength={5}
                placeholder="Prefijo de la categoria"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* nombre de la categoria */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de la categoria es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre de la categoria">
              <Input
                {...field}
                maxLength={50}
                placeholder="Nombre"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* descripcion */}
      <Col xs={24} sm={24} style={{ width: "100%" }}>
        <Controller
          name="descripcion"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "La descripcion es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Descripcion">
              <TextArea
                {...field}
                maxLength={200}
                placeholder="Equipo Computo"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>
    </Row>
  );
};
