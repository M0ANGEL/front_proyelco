import { useEffect } from "react";
import { Col, Input, Row, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { Props } from "./types";
import { StyledFormItem } from "@/components/layout/styled";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("nombre", TkCategoria?.nombre);
      methods.setValue("ruta", TkCategoria?.ruta);
      methods.setValue("link_power_bi", TkCategoria?.link_power_bi);
    } else {
      /*  methods.setValue('estado', '1') */
    }
  }, [TkCategoria]);
  return (
    <Row gutter={24}>
      {/* nombre  */}
      <Col xs={24} sm={4} style={{ width: "100%" }}>
        <Controller
          name="nombre"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre de la empresa es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre del modulo">
              <Input
                {...field}
                maxLength={50}
                placeholder="Informe"
                status={error && "error"}
                style={{ textTransform: "uppercase" }}
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* link_power_bi */}
      <Col xs={24} sm={20} style={{ width: "100%" }}>
        <Controller
          name="link_power_bi"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Link PowerBi es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Link PowerBi">
              <Input
                {...field}
                placeholder="https//:l-o:v"
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
