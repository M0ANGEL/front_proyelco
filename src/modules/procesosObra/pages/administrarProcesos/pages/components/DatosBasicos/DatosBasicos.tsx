import { useEffect, useState } from "react";
import { Col, Input, Row, Select, SelectProps, Typography } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { StyledFormItem } from "@/modules/common/layout/DashboardLayout/styled";
import { Props } from "./types";
import { getTipoProyectos } from "@/services/salud/conveniosTipoAPI";

const { Text } = Typography;

export const DatosBasicos = ({ TkCategoria }: Props) => {
  const methods = useFormContext();
  const [selectTipoProyecto, setselectTipoProyecto] = useState<
    SelectProps["options"]
  >([]);

  useEffect(() => {
    const fetchSelects = async () => {
      await getTipoProyectos().then(({ data: { data } }) => {
        setselectTipoProyecto(
          data.map((item) => ({
            value: item.id.toString(),
            label: `(${item.id}) ${item.nombre_tipo}`,
          }))
        );
      });
    };
    fetchSelects().catch((error) => {
      console.error(error);
    });
  }, []);

  useEffect(() => {
    //si tenemos datos en categoria agregamos a metho los datos
    if (TkCategoria) {
      methods.setValue("tipoPoryecto_id", TkCategoria?.tipoPoryecto_id.toString());
      methods.setValue("nombre_proceso", TkCategoria?.nombre_proceso);
      
    } 
  }, [TkCategoria]);
  return (
    <Row gutter={24}>
      {/* Tipo Proyecto */}
      <Col xs={24} sm={12}>
        <Controller
          name="tipoPoryecto_id"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Tipo de proyecto es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Tipo Proyecto:">
              <Select
                {...field}
                status={error && "error"}
                options={selectTipoProyecto}
                placeholder="Tipo de Proyecto"
              />
              <Text type="danger">{error?.message}</Text>
            </StyledFormItem>
          )}
        />
      </Col>

      {/* nombre del proceso */}
      <Col xs={24} sm={12} style={{ width: "100%" }}>
        <Controller
          name="nombre_proceso"
          control={methods.control}
          rules={{
            required: {
              value: true,
              message: "Nombre del  proceso es requerido",
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <StyledFormItem required label="Nombre del proceso">
              <Input
                {...field}
                maxLength={50}
                placeholder="Fundia"
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
